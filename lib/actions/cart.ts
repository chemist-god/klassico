"use server";

import { prisma } from "@/lib/db/prisma";

// Placeholder userId - will be replaced with actual auth later
const PLACEHOLDER_USER_ID = "placeholder-user-id";

export async function getCart() {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: PLACEHOLDER_USER_ID },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: cartItems };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { success: false, error: "Failed to fetch cart" };
  }
}

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: PLACEHOLDER_USER_ID,
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
      return { success: true, data: updated };
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: PLACEHOLDER_USER_ID,
        productId,
        quantity,
      },
      include: { product: true },
    });
    return { success: true, data: cartItem };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove item from cart" };
  }
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }
    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, error: "Failed to update cart item" };
  }
}

