"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";
import { generateBitcoinAddress, validateBitcoinAddress } from "@/lib/utils/bitcoin";

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

    // Check if wallet already exists with an address
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId },
      select: { address: true, updatedAt: true },
    });

    // Rate limiting: Prevent address regeneration within 24 hours
    if (existingWallet?.address) {
      const lastUpdate = existingWallet.updatedAt;
      const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceUpdate < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceUpdate);
        throw new Error(
          `Address already generated. Please wait ${hoursRemaining} hour(s) before generating a new address.`
        );
      }
    }

    // Generate secure Bitcoin address using HD wallet
    const address = generateBitcoinAddress(userId);

    // Validate the generated address before storing
    if (!validateBitcoinAddress(address)) {
      throw new Error("Generated address failed validation. Please try again.");
    }

    // Update or create wallet with the new address
    const wallet = await prisma.wallet.upsert({
      where: { userId },
      update: {
        address,
        updatedAt: new Date(),
      },
      create: {
        userId,
        balance: 0,
        address,
      },
    });

    return wallet;
  }, "Failed to generate wallet address");
}
