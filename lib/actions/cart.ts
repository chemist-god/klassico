"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";

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

export async function addToCart(productId: string, quantity: number = 1) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
      return updated;
    }

    // Create new cart item
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

export async function removeFromCart(cartItemId: string) {
  return withErrorHandling(async () => {
    await requireAuth(); // Ensure user is authenticated
    await prisma.cartItem.delete({
      where: { id: cartItemId },
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
