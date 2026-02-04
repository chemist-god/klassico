"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";
import { revalidatePath } from "next/cache";
import { businessConfig, orderLimits } from "@/lib/config/business";
import {
  generateReceiptNumber,
  generateTransactionId,
  calculateOrderTotals,
} from "@/lib/utils/receipt-helpers";
import {
  checkRateLimit,
  incrementRateLimit,
  formatRateLimitMessage,
} from "@/lib/utils/rate-limiter";

type CartItemWithProduct = {
  productId: string;
  product: { price: number };
  quantity: number;
};

export async function getOrders() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  }, "Failed to fetch orders");
}

export async function getOrder(orderId: string) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
        transaction: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
            createdAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      throw new Error("Unauthorized access to order");
    }

    return order;
  }, "Failed to fetch order");
}

/**
 * Get count of user's pending orders (internal use)
 * Used for validation before creating new orders
 * 
 * @param userId - User ID to check
 * @returns Count of pending orders
 */
async function getPendingOrderCountInternal(userId: string): Promise<number> {
  return prisma.order.count({
    where: {
      userId,
      status: "Pending",
    },
  });
}

/**
 * Get user's pending order count with auth
 * This is the public-facing function that handles authentication
 * 
 * @returns Count of pending orders for authenticated user
 */
export async function getUserPendingOrderCount() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    const count = await getPendingOrderCountInternal(userId);
    return count;
  }, "Failed to get pending order count");
}

/**
 * Create order from cart items
 * 
 * This function now handles product status management:
 * 1. Validates rate limits and pending order counts
 * 2. Creates order with items
 * 3. Updates product status to "Pending"
 * 4. Removes cart items
 * 
 * @param cartItemIds - Array of cart item IDs to create order from
 */
export async function createOrder(cartItemIds: string[]) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    // ========================================
    // ANTI-SPAM PROTECTION: Rate Limit Check
    // ========================================
    const rateLimitResult = checkRateLimit(userId, "create_order");
    if (!rateLimitResult.allowed) {
      throw new Error(formatRateLimitMessage(rateLimitResult.waitMinutes));
    }

    // ========================================
    // ANTI-SPAM PROTECTION: Pending Orders Check
    // ========================================
    const pendingOrderCount = await getPendingOrderCountInternal(userId);

    // Hard block if too many pending orders
    if (pendingOrderCount >= orderLimits.maxPendingOrders) {
      throw new Error(
        `You have ${pendingOrderCount} unpaid orders. Please complete or cancel them before creating new orders.`
      );
    }

    // Step 1: Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new Error("No items in cart");
    }

    // Step 2: Calculate totals with tax
    const subtotal = cartItems.reduce(
      (sum: number, item: CartItemWithProduct) =>
        sum + item.product.price * item.quantity,
      0
    );

    const totals = calculateOrderTotals(subtotal, businessConfig.defaultTaxRate);
    const receiptNumber = generateReceiptNumber();
    const transactionId = generateTransactionId();

    // Step 3: Create order with items and transaction
    const order = await prisma.order.create({
      data: {
        userId,
        receiptNumber,
        transactionId,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        taxRate: totals.taxRate,
        total: totals.total,
        paymentMethod: "Pending Payment",
        status: "Pending",
        items: {
          create: cartItems.map((item: CartItemWithProduct) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
        transaction: {
          create: {
            userId,
            amount: totals.total,
            type: "purchase",
            method: "crypto",
            status: "pending",
          },
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        transaction: true,
      },
    });

    // Step 4: Update product status to "Pending" for all products in order
    // This marks them as being processed
    const productIds = cartItems.map((item) => item.productId);
    await prisma.product.updateMany({
      where: {
        id: { in: productIds },
        status: "Available", // Only update if still available
      },
      data: {
        status: "Pending",
      },
    });

    // Step 5: Remove cart items
    await prisma.cartItem.deleteMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
    });

    // ========================================
    // ANTI-SPAM PROTECTION: Increment Rate Limit
    // ========================================
    incrementRateLimit(userId, "create_order");

    // Create Notification
    try {
      const { createNotification } = await import("@/lib/actions/notifications");
      await createNotification(
        userId,
        "Order Placed Successfully",
        `Order #${order.id.slice(0, 8)} has been placed and is being processed.`,
        "success"
      );
    } catch (e) {
      console.error("Failed to create order notification", e);
    }

    revalidatePath("/user/cart");
    return order;
  }, "Failed to create order");
}

/**
 * Update order status
 * 
 * This function handles product status updates:
 * - When order is "Completed": Update products to "Sold"
 * - When order is "Cancelled": Update products back to "Available"
 * 
 * @param orderId - The order ID to update
 * @param status - New status (Pending, Processing, Completed, Cancelled)
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<void> {
  await withErrorHandling(async () => {
    const userId = await requireAuth();

    // Get order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: { productId: true },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      throw new Error("Unauthorized access to order");
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Update product statuses based on order status
    const productIds = order.items.map((item) => item.productId);

    if (status === "Completed") {
      // Mark products as sold
      await prisma.product.updateMany({
        where: {
          id: { in: productIds },
        },
        data: {
          status: "Sold",
        },
      });
    } else if (status === "Cancelled") {
      // Return products to available (if they were pending)
      await prisma.product.updateMany({
        where: {
          id: { in: productIds },
          status: "Pending",
        },
        data: {
          status: "Available",
        },
      });
    }
    // For "Processing" status, keep products as "Pending"
  }, "Failed to update order status");
}

/**
 * Create OxaPay payment for an order
 * 
 * This function:
 * 1. Calls OxaPay API to create invoice
 * 2. Updates order with payment details
 * 3. Returns payment information for display
 * 
 * @param orderId - The order ID to create payment for
 */
export async function createOrderPayment(orderId: string) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      throw new Error("Unauthorized access to order");
    }

    // Check if payment already created
    if (order.paymentTrackId) {
      throw new Error("Payment already created for this order");
    }

    // Import OxaPay service
    const { createInvoice } = await import("@/lib/services/oxapay");
    const { genVariable } = await import("@/lib/config/genVariable");

    // Construct full logo URL if available
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://klassico.vercel.app";
    const logoUrl = `${siteUrl}${genVariable.assets.logoUrl}`; // Will be /logo.png

    // Create OxaPay invoice
    const invoice = await createInvoice({
      amount: order.total,
      currency: "USD",
      orderId: order.id,
      email: order.user.email,
      description: `Order #${order.receiptNumber || order.id.slice(0, 8)}`,
      returnUrl: `${siteUrl}/user/orders/${order.id}?new=true`,
      name: genVariable.app.displayName, // "Klassico"
      logoUrl: logoUrl, // Full URL to logo (will show when file exists)
    });

    // Calculate expiration time
    const expiresAt = new Date(invoice.data.expired_at * 1000);

    // Update order with payment details
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProvider: "oxapay",
        paymentTrackId: invoice.data.track_id,
        paymentUrl: invoice.data.payment_url,
        paymentExpiresAt: expiresAt,
        paymentMethod: "Bitcoin (OxaPay)",
      },
      include: {
        items: {
          include: { product: true },
        },
        transaction: true,
      },
    });

    return {
      order: updatedOrder,
      payment: {
        trackId: invoice.data.track_id,
        paymentUrl: invoice.data.payment_url,
        expiresAt: expiresAt.toISOString(),
      },
    };
  }, "Failed to create order payment");
}

/**
 * Cancel a pending order
 * 
 * This function:
 * 1. Verifies user owns the order
 * 2. Checks order status is "Pending"
 * 3. Updates order status to "Cancelled"
 * 4. Updates transaction status to "failed"
 * 5. Releases products back to "Available"
 * 6. Creates notification
 * 
 * @param orderId - The order ID to cancel
 */
export async function cancelOrder(orderId: string) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    // Get order with items and transaction
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: { productId: true },
        },
        transaction: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      throw new Error("Unauthorized access to order");
    }

    // Only allow cancellation of pending orders
    if (order.status !== "Pending") {
      throw new Error(
        `Cannot cancel order with status "${order.status}". Only pending orders can be cancelled.`
      );
    }

    // Use transaction for atomic updates
    await prisma.$transaction(async (tx) => {
      // Update order status to Cancelled
      await tx.order.update({
        where: { id: orderId },
        data: { status: "Cancelled" },
      });

      // Update transaction status to failed
      if (order.transaction) {
        await tx.transaction.update({
          where: { id: order.transaction.id },
          data: {
            status: "failed",
            metadata: JSON.stringify({
              status: "cancelled",
              reason: "User cancelled order",
              cancelledAt: new Date().toISOString(),
            }),
          },
        });
      }

      // Release products back to Available status
      const productIds = order.items.map((item) => item.productId);
      if (productIds.length > 0) {
        await tx.product.updateMany({
          where: {
            id: { in: productIds },
            status: "Pending", // Only update if still pending
          },
          data: {
            status: "Available",
          },
        });
      }
    });

    // Create notification
    try {
      const { createNotification } = await import("@/lib/actions/notifications");
      await createNotification(
        userId,
        "Order Cancelled",
        `Order #${order.receiptNumber || order.id.slice(0, 8)} has been cancelled. Products have been released.`,
        "info"
      );
    } catch (e) {
      console.error("Failed to create cancellation notification", e);
    }

    revalidatePath("/user/orders");
    revalidatePath(`/user/orders/${orderId}`);
    revalidatePath(`/user/orders/${orderId}/pay`);

    return { success: true, orderId };
  }, "Failed to cancel order");
}
