"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";

export async function getTickets() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    const tickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return tickets;
  }, "Failed to fetch tickets");
}

export async function createTicket(data: { subject: string; message: string }) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    if (!data.subject || !data.message) {
      throw new Error("Subject and message are required");
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId,
        subject: data.subject,
        message: data.message,
        status: "Open",
      },
    });
    return ticket;
  }, "Failed to create ticket");
}
