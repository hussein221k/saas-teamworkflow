"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/middleware/auth";
import { Message } from "@/schema/MessageSchema";

type ChatResponse<T = unknown> = {
  success: boolean;
  message?: T;
  messages?: T;
  error?: string;
};

export async function sendMessage(
  team_id: string,
  content: string,
  channel_id?: string,
  receiver_id?: string,
): Promise<ChatResponse<Message>> {
  let sessionUser;
  try {
    sessionUser = await requireAuth();
  } catch (err) {
    return { success: false, error: "Unauthorized" };
  }

  if (!content || !team_id) {
    return { success: false, error: "Invalid input" };
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        content,
        team_id,
        user_id: sessionUser.id,
        channel_id: channel_id || null,
        receiver_id: receiver_id || null,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    revalidatePath(`/dashboard/${team_id}`);
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
): Promise<ChatResponse<Message[]>> {
  try {
    let sessionUser;
    try {
      sessionUser = await requireAuth();
    } catch {
      return { success: false, messages: [], error: "Not authenticated" };
    }

    // Build simple where clause - avoid complex typing that can cause issues
    const queryOptions: {
      where: {
        team_id: string;
        channel_id?: string | null;
        receiver_id?: string | null;
        OR?: Array<{ user_id: string; receiver_id: string }>;
      };
      orderBy: { created_at: "asc" };
      include: { user: { select: { id: true; name: true } } };
    } = {
      where: { team_id },
      orderBy: { created_at: "asc" },
      include: { user: { select: { id: true, name: true } } },
    };

    if (receiver_id && receiver_id.length > 0) {
      // Direct Message: show messages between current user and receiver
      queryOptions.where.OR = [
        { user_id: sessionUser.id, receiver_id },
        { user_id: receiver_id, receiver_id: sessionUser.id },
      ];
    } else if (channel_id && channel_id.length > 0) {
      // Channel message: filter by channel_id
      queryOptions.where.channel_id = channel_id;
      queryOptions.where.receiver_id = null;
    } else {
      // No channel selected - show only global messages (no channel_id, no receiver_id)
      queryOptions.where.channel_id = null;
      queryOptions.where.receiver_id = null;
    }

    const messages = await prisma.message.findMany(queryOptions);

    return { success: true, messages: messages || [] };
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return { success: false, messages: [], error: String(error) };
  }
}
