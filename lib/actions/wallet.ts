"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";

export async function getWallet() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
      });
    }

    return wallet;
  }, "Failed to fetch wallet");
}

export async function generateWalletAddress() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    // Generate a wallet address (in real app, this would use crypto library)
    const address = `0x${Math.random().toString(16).substring(2, 42)}`;

    const wallet = await prisma.wallet.upsert({
      where: { userId },
      update: { address },
      create: {
        userId,
        balance: 0,
        address,
      },
    });

    return wallet;
  }, "Failed to generate wallet address");
}
