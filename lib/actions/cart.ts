"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";
import { getOrCreateProduct } from "@/lib/utils/product-helpers";
import { cleanupOrphanedProduct } from "@/lib/utils/product-cleanup";

/**
 * Get user's cart items
 */
export async function getCart() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return cartItems;
  }, "Failed to fetch cart");
}

/**
 * Add item to cart
 * 
 * This function now handles product creation/reuse:
 * 1. Ensures product exists (creates from bank log if needed)
 * 2. Adds or updates cart item
 * 
 * @param bankLogId - The bank log ID (e.g., "bl-1")
 * @param quantity - Quantity to add (default: 1)
 */
export async function addToCart(bankLogId: string, quantity: number = 1) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    // Step 1: Get or create product from bank log
    // This ensures the product exists in the database
    const productId = await getOrCreateProduct(bankLogId);

    // Step 2: Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity if item already exists
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
      return updated;
    }

    // Step 3: Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: { product: true },
    });
    return cartItem;
  }, "Failed to add item to cart");
}

/**
 * Remove item from cart
 * 
 * This function now handles cleanup:
 * 1. Removes cart item
 * 2. Checks if product is orphaned
 * 3. Cleans up orphaned product if safe
 * 
 * @param cartItemId - The cart item ID to remove
 */
export async function removeFromCart(cartItemId: string) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    // Step 1: Get cart item to retrieve product ID
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { productId: true, userId: true },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // Step 2: Verify user owns this cart item
    if (cartItem.userId !== userId) {
      throw new Error("Unauthorized: Cannot remove another user's cart item");
    }

    // Step 3: Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    // Step 4: Cleanup orphaned product (non-blocking)
    // We do this asynchronously to not slow down the response
    cleanupOrphanedProduct(cartItem.productId).catch((error) => {
      // Log error but don't fail the request
      console.error("Error cleaning up orphaned product:", error);
    });

    return true;
  }, "Failed to remove item from cart");
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  return withErrorHandling(async () => {
    await requireAuth(); // Ensure user is authenticated
    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });
    return updated;
  }, "Failed to update cart item");
}
