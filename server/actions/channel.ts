"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createChannel(teamId: number, name: string) {
  try {
    const channel = await (prisma as any).channel.create({
      data: {
        name,
        teamId,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, channel };
  } catch (error) {
    console.error("Failed to create channel:", error);
    return { success: false, error: "Failed to create channel" };
  }
}

export async function getTeamChannels(teamId: number) {
  try {
    const channels = await (prisma as any).channel.findMany({
      where: { teamId },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, channels };
  } catch (error) {
    console.error("Failed to fetch channels:", error);
    return { success: false, channels: [] };
  }
}

export async function deleteChannel(channelId: number) {
    try {
        await (prisma as any).channel.delete({
            where: { id: channelId }
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Deletion failed" };
    }
}
