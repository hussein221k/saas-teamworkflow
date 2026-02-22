"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function updateUserProfile(
  formData: { name: string },
  user_id: string,
) {
  const sessionUser = await getSession();

  if (!sessionUser || !sessionUser.email) {
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
  const sessionUser = await getSession();

  if (!sessionUser || !sessionUser.email) {
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
