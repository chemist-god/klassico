import { NextRequest } from "next/server";
import { removeFromCart, updateCartItem } from "@/lib/actions/cart";
import { apiHandler, parseRequestBody, validateRequiredFields } from "@/lib/utils/api-handler";

export const DELETE = apiHandler(
  async (request?: NextRequest, context?: { params?: Promise<{ id: string }> }) => {
    if (!context?.params) {
      return { success: false, error: "Cart item ID is required" };
    }
    const { id } = await context.params;
    return await removeFromCart(id);
  }
);

export const PUT = apiHandler(
  async (request?: NextRequest, context?: { params?: Promise<{ id: string }> }) => {
    if (!request || !context?.params) {
      return { success: false, error: "Request and cart item ID are required" };
    }
    const { id } = await context.params;
    const body = await parseRequestBody<{ quantity: number }>(request);

    const validation = validateRequiredFields(body, ["quantity"]);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    return await updateCartItem(id, body.quantity);
  }
);
