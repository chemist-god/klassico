"use server";

import { getSession } from "@/lib/auth/session";

export async function getCurrentUser() {
    try {
        const user = await getSession();
        if (!user) {
            return { success: false, error: "Not authenticated" };
        }
        return { success: true, data: user };
    } catch (error) {
        console.error("Error getting current user:", error);
        return { success: false, error: "Failed to get user" };
    }
}

