"use server";

import { prisma } from "@/lib/db/prisma";
import { getCurrentUserId } from "@/lib/auth/session";

export async function getDashboardStats() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const [wallet, orders] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId },
      }),
      prisma.order.findMany({
        where: { userId },
      }),
    ]);

    const availableFunds = wallet?.balance || 0;
    const totalCompleted = orders.filter((o) => o.status === "Completed").length;
    const awaitingProcessing = orders.filter(
      (o) => o.status === "Pending" || o.status === "Processing"
    ).length;

    return {
      success: true,
      data: {
        availableFunds,
        totalCompleted,
        awaitingProcessing,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

export async function getBankLogs() {
  try {
    // Bank logs are essentially products available for purchase
    const products = await prisma.product.findMany({
      where: { status: "Available" },
      orderBy: { createdAt: "desc" },
    });

    // Transform products to bank log format
    const bankLogs = products.map((product) => ({
      id: product.id,
      product: product.name,
      type: product.type,
      bank: product.bank,
      balance: product.balance,
      price: product.price,
      region: product.region,
      status: product.status,
      description: product.description || "",
    }));

    return { success: true, data: bankLogs };
  } catch (error) {
    console.error("Error fetching bank logs:", error);
    return { success: false, error: "Failed to fetch bank logs" };
  }
}

