"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

const UserUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function updateUserProfile(formData: { name: string }) {
  const sessionUser = await getSession();

  if (!sessionUser || !sessionUser.email) {
    return { success: false, error: "Unauthorized" };
  }

  const result = UserUpdateSchema.safeParse(formData);
  if (!result.success) {
    const error =
      result.error.flatten().fieldErrors.name?.[0] || "Invalid input";
    return { success: false, error };
  }

  try {
    await prisma.user.update({
      where: { email: sessionUser.email },
      data: { name: result.data.name },
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
