"use server";

import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { MessageSchema } from "@/schema/MessageSchema";

export async function sendMessage(teamId: number, content: string, channelId?: number) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return { success: false, error: "Unauthorized" };
  }

  const parse = MessageSchema.safeParse({ content, teamId });
  if (!parse.success) {
      const errorMsg = parse.error.issues[0]?.message || "Invalid input";
      return { success: false, error: errorMsg };
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    return { success: false, error: "User not found" };
  }

  try {
    const newMessage = await (prisma.message as any).create({
      data: {
        content: parse.data.content,
        teamId: parse.data.teamId,
        userId: dbUser.id,
        channelId: channelId || null,
      },
      include: {
        user: { select: { name: true } }
      }
    });

    revalidatePath("/dashboard");
    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function getTeamMessages(teamId: number, channelId?: number) {
  try {
    const messages = await (prisma.message as any).findMany({
      where: { 
          teamId,
          channelId: channelId || null 
      },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
            select: { name: true, email: true }
        }
      }
    });

    return { success: true, messages };
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return { success: false, messages: [] };
  }
}
