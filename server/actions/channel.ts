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

    // automatically add all current team members into the channel membership list
    const teamUsers = await prisma.user.findMany({
      where: { team_id },
      select: { id: true },
    });

    if (teamUsers.length) {
      // createMany guards against duplicates
      await prisma.channel_member.createMany({
        data: teamUsers.map((u) => ({ channel_id: channel.id, user_id: u.id })),
        skipDuplicates: true,
      });
    }

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

// ---------------------------------------------------------------------------
// membership helpers
// ---------------------------------------------------------------------------

export async function getChannelMembers(channel_id: string) {
  try {
    const members = await prisma.channel_member.findMany({
      where: { channel_id },
      include: { user: true },
    });
    return members.map((m) => m.user);
  } catch (error) {
    console.error("Failed to fetch channel members:", error);
    return [];
  }
}

export async function addChannelMember(channel_id: string, user_id: string) {
  try {
    await prisma.channel_member.create({
      data: { channel_id, user_id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to add channel member:", error);
    return { success: false, error: "Add member failed" };
  }
}

export async function removeChannelMember(channel_id: string, user_id: string) {
  try {
    await prisma.channel_member.delete({
      where: { channel_id_user_id: { channel_id, user_id } },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove channel member:", error);
    return { success: false, error: "Remove member failed" };
  }
}
