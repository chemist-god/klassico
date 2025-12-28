"use server";

import { prisma } from "@/lib/db/prisma";

// Placeholder userId - will be replaced with actual auth later
const PLACEHOLDER_USER_ID = "placeholder-user-id";

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: PLACEHOLDER_USER_ID },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function getOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    if (!order) {
      return { success: false, error: "Order not found" };
    }
    return { success: true, data: order };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, error: "Failed to fetch order" };
  }
}

export async function createOrder(cartItemIds: string[]) {
  try {
    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        userId: PLACEHOLDER_USER_ID,
      },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return { success: false, error: "No items in cart" };
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: PLACEHOLDER_USER_ID,
        total,
        status: "Pending",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Remove cart items
    await prisma.cartItem.deleteMany({
      where: {
        id: { in: cartItemIds },
        userId: PLACEHOLDER_USER_ID,
      },
    });

    return { success: true, data: order };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

