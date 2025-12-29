import { NextRequest } from "next/server";
import { getTickets, createTicket } from "@/lib/actions/tickets";
import { apiHandler, parseRequestBody, validateRequiredFields } from "@/lib/utils/api-handler";

export const GET = apiHandler(async () => {
  return await getTickets();
});

export const POST = apiHandler(async (request?: NextRequest) => {
  if (!request) {
    return { success: false, error: "Request is required" };
  }
  const body = await parseRequestBody<{ subject: string; message: string }>(request);

  const validation = validateRequiredFields(body, ["subject", "message"]);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  return await createTicket({ subject: body.subject, message: body.message });
}, { successStatus: 201 });
