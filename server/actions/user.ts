"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// shared auth/validation helpers
import { requireAuth } from "@/middleware/auth";

export async function updateUserProfile(
  formData: { name: string },
  user_id: string,
) {
  let sessionUser;
  try {
    sessionUser = await requireAuth();
  } catch (err) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.user.update({
      where: { id: user_id },
      data: formData,
    });

    revalidatePath("/profile");
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function deleteUserAccount() {
  let sessionUser;
  try {
    sessionUser = await requireAuth();
  } catch (err) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.user.delete({
      where: { email: sessionUser.email },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
