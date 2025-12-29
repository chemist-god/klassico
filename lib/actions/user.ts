"use server";

import { requireUser } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";

export async function getCurrentUser() {
    return withErrorHandling(async () => {
        const user = await requireUser();
        return user;
    }, "Failed to get user");
}
