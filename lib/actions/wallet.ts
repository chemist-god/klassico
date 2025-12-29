"use server";

import { prisma } from "@/lib/db/prisma";
import { getCurrentUserId } from "@/lib/auth/session";

export async function getWallet() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

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

    return { success: true, data: wallet };
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return { success: false, error: "Failed to fetch wallet" };
  }
}

export async function generateWalletAddress() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

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

    return { success: true, data: wallet };
  } catch (error) {
    console.error("Error generating wallet address:", error);
    return { success: false, error: "Failed to generate wallet address" };
  }
}

