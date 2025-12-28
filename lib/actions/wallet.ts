"use server";

import { prisma } from "@/lib/db/prisma";

// Placeholder userId - will be replaced with actual auth later
const PLACEHOLDER_USER_ID = "placeholder-user-id";

export async function getWallet() {
  try {
    let wallet = await prisma.wallet.findUnique({
      where: { userId: PLACEHOLDER_USER_ID },
    });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: PLACEHOLDER_USER_ID,
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
    // Generate a placeholder address (in real app, this would use crypto library)
    const address = `0x${Math.random().toString(16).substring(2, 42)}`;

    const wallet = await prisma.wallet.upsert({
      where: { userId: PLACEHOLDER_USER_ID },
      update: { address },
      create: {
        userId: PLACEHOLDER_USER_ID,
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

