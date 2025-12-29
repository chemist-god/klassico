import { NextRequest } from "next/server";
import { getOrders, createOrder } from "@/lib/actions/orders";
import { apiHandler, parseRequestBody } from "@/lib/utils/api-handler";

export const GET = apiHandler(async () => {
  return await getOrders();
});

export const POST = apiHandler(async (request?: NextRequest) => {
  if (!request) {
    return { success: false, error: "Request is required" };
  }
  const body = await parseRequestBody<{ cartItemIds: string[] }>(request);

  if (!body.cartItemIds || !Array.isArray(body.cartItemIds)) {
    return { success: false, error: "cartItemIds array is required" };
  }

  return await createOrder(body.cartItemIds);
}, { successStatus: 201 });
