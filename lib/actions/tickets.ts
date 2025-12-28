"use server";

import { prisma } from "@/lib/db/prisma";

// Placeholder userId - will be replaced with actual auth later
const PLACEHOLDER_USER_ID = "placeholder-user-id";

export async function getTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: PLACEHOLDER_USER_ID },
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
    const ticket = await prisma.ticket.create({
      data: {
        userId: PLACEHOLDER_USER_ID,
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

