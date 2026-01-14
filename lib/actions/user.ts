"use server";

import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, requireUser } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";
import {
  sanitizeEmail,
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/utils/validation";

export async function getCurrentUser() {
  return withErrorHandling(async () => {
    const user = await requireUser();
    return user;
  }, "Failed to get user");
}

export async function updateUserProfile(data: { username: string; email: string }) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    const username = sanitizeInput(data.username);
    const email = sanitizeEmail(data.email);

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      throw new Error(usernameValidation.error);
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new Error(emailValidation.error);
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
        NOT: { id: userId },
      },
      select: { username: true, email: true },
    });

    if (existingUser?.username === username) {
      throw new Error("Username already exists. Please choose a different username.");
    }

    if (existingUser?.email === email) {
      throw new Error("Email already registered. Please use a different email.");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return updatedUser;
  }, "Failed to update profile");
}

export async function updateUserPassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      throw new Error("All password fields are required");
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new Error("New passwords do not match");
    }

    const passwordValidation = validatePassword(data.newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user?.password) {
      throw new Error("Unable to verify current password");
    }

    const isCurrentPasswordValid = await compare(data.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const isSamePassword = await compare(data.newPassword, user.password);
    if (isSamePassword) {
      throw new Error("New password must be different from current password");
    }

    const hashedPassword = await hash(data.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return true;
  }, "Failed to update password");
}
