"use server";

import { prisma } from "@/lib/db/prisma";
import { getCurrentUserId } from "@/lib/auth/session";

export async function getTickets() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: tickets };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return { success: false, error: "Failed to fetch tickets" };
  }
}

export async function createTicket(data: { subject: string; message: string }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId,
        subject: data.subject,
        message: data.message,
        status: "Open",
      },
    });
    return { success: true, data: ticket };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error: "Failed to create ticket" };
  }
}

