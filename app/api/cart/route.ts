import { NextRequest } from "next/server";
import { getCart, addToCart } from "@/lib/actions/cart";
import { apiHandler, parseRequestBody, validateRequiredFields } from "@/lib/utils/api-handler";

export const GET = apiHandler(async () => {
  return await getCart();
});

export const POST = apiHandler(async (request?: NextRequest) => {
  if (!request) {
    return { success: false, error: "Request is required" };
  }
  const body = await parseRequestBody<{ productId: string; quantity?: number }>(request);

  const validation = validateRequiredFields(body, ["productId"]);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  return await addToCart(body.productId, body.quantity || 1);
}, { successStatus: 201 });
