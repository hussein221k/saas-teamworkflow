"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const UserUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function updateUserProfile(formData: { name: string }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return { success: false, error: "Unauthorized" };
  }

  const result = UserUpdateSchema.safeParse(formData);
  if (!result.success) {
    const error = result.error.flatten().fieldErrors.name?.[0] || "Invalid input";
    return { success: false, error };
  }

  try {
    await prisma.user.update({
      where: { email: user.email },
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
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user || !user.email) {
      return { success: false, error: "Unauthorized" };
    }

    try {
        // In a real app, you'd delete from Auth provider (Kinde) AND DB.
        // Here we just delete from DB.
        await prisma.user.delete({
            where: { email: user.email }
        });
        
        return { success: true };
    } catch (error) {
        console.error("Failed to delete account:", error);
        return { success: false, error: "Failed to delete account" };
    }
}
