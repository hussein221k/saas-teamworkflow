/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createChannel(team_id: string, name: string) {
  try {
    const channel = await prisma.channel.create({
      data: {
        name,
        team_id,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, channel };
  } catch (error) {
    console.error("Failed to create channel:", error);
    return { success: false, error: "Failed to create channel" };
  }
}

export async function getTeamChannels(team_id: string) {
  try {
    const channels = await prisma.channel.findMany({
      where: { team_id },
      orderBy: { created_at: "asc" },
    });
    return { success: true, channels };
  } catch (error) {
    console.error("Failed to fetch channels:", error);
    return { success: false, channels: [] };
  }
}

export async function deleteChannel(channel_id: string) {
  try {
    await prisma.channel.delete({
      where: { id: channel_id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Deletion failed" };
  }
}
