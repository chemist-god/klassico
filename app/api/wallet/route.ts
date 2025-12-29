import { NextRequest } from "next/server";
import { getWallet, generateWalletAddress } from "@/lib/actions/wallet";
import { apiHandler } from "@/lib/utils/api-handler";

export const GET = apiHandler(async () => {
  return await getWallet();
});

export const POST = apiHandler(async () => {
  return await generateWalletAddress();
}, { successStatus: 201 });
