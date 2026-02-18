"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { MessageSchema } from "@/schema/MessageSchema";

export async function sendMessage(
  team_id: string,
  content: string,
  channel_id?: string,
  receiver_id?: string,
) {
  const sessionUser = await getSession();

  if (!sessionUser) {
    return { success: false, error: "Unauthorized" };
  }

  const parse = MessageSchema.safeParse({ content, team_id });
  if (!parse.success) {
    const errorMsg = parse.error.issues[0]?.message || "Invalid input";
    return { success: false, error: errorMsg };
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        content: parse.data.content,
        team_id: parse.data.team_id,
        user_id: sessionUser.id,
        channel_id: channel_id || null,
        receiver_id: receiver_id || null,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function getTeamMessages(
  team_id: string,
  channel_id?: string,
  receiver_id?: string,
) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) return { success: false, messages: [] };

    const where: any = { team_id };

    if (receiver_id) {
      // Direct Message logic: (A -> B) OR (B -> A)
      where.OR = [
        { user_id: sessionUser.id, receiver_id },
        { user_id: receiver_id, receiver_id: sessionUser.id },
      ];
    } else {
      // Channel or Global chat
      where.channel_id = channel_id || null;
      where.receiver_id = null; // Ensure we don't mix DMs into channel chat
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { created_at: "asc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return { success: true, messages };
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return { success: false, messages: [] };
  }
}
