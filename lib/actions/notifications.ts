"use server";

import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/actions/user";
import { revalidatePath } from "next/cache";

export type NotificationType = "info" | "success" | "warning" | "error";

export async function getNotifications(limit = 10) {
    try {
        const userResult = await getCurrentUser();
        if (!userResult.success || !userResult.data) {
            return { success: false, error: "Unauthorized" };
        }
        const userId = userResult.data.id;

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        const unreadCount = await prisma.notification.count({
            where: { userId, read: false },
        });

        return { success: true, data: { notifications, unreadCount } };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { success: false, error: "Failed to fetch notifications" };
    }
}

export async function markAsRead(notificationId: string) {
    try {
        const userResult = await getCurrentUser();
        if (!userResult.success || !userResult.data) return { success: false };

        await prisma.notification.update({
            where: { id: notificationId, userId: userResult.data.id },
            data: { read: true },
        });

        revalidatePath("/user");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to mark as read" };
    }
}

export async function markAllAsRead() {
    try {
        const userResult = await getCurrentUser();
        if (!userResult.success || !userResult.data) return { success: false };

        await prisma.notification.updateMany({
            where: { userId: userResult.data.id, read: false },
            data: { read: true },
        });

        revalidatePath("/user");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to mark all as read" };
    }
}

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = "info"
) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
            },
        });
        return { success: true, data: notification };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false, error: "Failed to create notification" };
    }
}
