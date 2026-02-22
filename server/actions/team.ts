/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/lib/prisma";
import { TeamSchema } from "@/schema/TeamSchema";
import { revalidatePath } from "next/cache";
import { secureAction } from "@/lib/security";

const ensureTeam = async (id: string) => {
  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) throw new Error("Cluster not found.");
  return team;
};

export async function createTeam(name: string, owner_id: string) {
  const security = await secureAction();
  if (security.denied) return { success: false, error: security.error };

  if (!name || name.trim().length < 2) {
    return { success: false, error: "Team name must be at least 2 characters" };
  }

  try {
    const newTeam = await prisma.team.create({
      data: {
        name: name.trim(),
        owner_id: owner_id,
        users: {
          connect: { id: owner_id },
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, team: newTeam };
  } catch (error) {
    console.error("Failed to create team:", error);
    return { success: false, error: "Failed to create team" };
  }
}

export async function updateTeam(team_id: string, name: string) {
  if (!name || name.trim().length < 2) {
    return { success: false, error: "Team name must be at least 2 characters" };
  }

  try {
    const updatedTeam = await prisma.team.update({
      where: { id: team_id },
      data: { name: name.trim() },
    });

    revalidatePath("/dashboard");
    return { success: true, team: updatedTeam };
  } catch (error) {
    console.error("Failed to update team:", error);
    return { success: false, error: "Failed to update team" };
  }
}

export async function deleteTeam(team_id: string) {
  try {
    await prisma.team.delete({
      where: { id: team_id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete team:", error);
    return { success: false, error: "Failed to delete team" };
  }
}

export async function getTeamsByOwner(owner_id: string) {
  try {
    const teams = await prisma.team.findMany({
      where: { owner_id },
      include: { _count: { select: { users: true } } },
    });
    return teams;
  } catch (error) {
    console.error("Failed to fetch owned teams:", error);
    return [];
  }
}

export async function getTeamMembers(team_id: string) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: team_id },
      include: { users: true },
    });
    return team?.users || [];
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

export async function removeMemberFromTeam(memberId: string, team_id: string) {
  try {
    // Validation: Check if the user trying to kick is the admin (should be done in UI-calling action, but here for safety)
    // For simplicity, we just set team_id to null if the member is not the owner
    const team = await ensureTeam(team_id);
    if (team.owner_id === memberId)
      return {
        success: false,
        error: "Owner cannot be expelled from their own cluster.",
      };

    await prisma.user.update({
      where: { id: memberId },
      data: { team_id: null },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Kick failure:", error);
    return { success: false, error: "Decommissioning protocol failed." };
  }
}

export async function generateTeamInvite(team_id: string) {
  try {
    const inviteCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    await prisma.team.update({
      where: { id: team_id },
      data: { invite_code: inviteCode },
    });
    revalidatePath("/dashboard");
    return { success: true, code: inviteCode };
  } catch (error) {
    return { success: false, error: "Neural link generation failed." };
  }
}

export async function joinTeamByCode(user_id: string, code: string) {
  const security = await secureAction();
  if (security.denied) return { success: false, error: security.error };

  const invite_code = code.trim().toUpperCase();
  if (!invite_code)
    return { success: false, error: "Invalid protocol string." };

  try {
    const team = await prisma.team.findUnique({
      where: { invite_code },
    });

    if (!team)
      return {
        success: false,
        error: "Signal lost: Cluster identity not found.",
      };

    await prisma.user.update({
      where: { id: user_id },
      data: { team_id: team.id },
    });

    revalidatePath("/dashboard");
    return { success: true, team_id: team.id };
  } catch (error) {
    return { success: false, error: "Synchronization error." };
  }
}

export async function switchTeam(user_id: string, team_id: string) {
  try {
    const team = await ensureTeam(team_id);

    if (team.owner_id !== user_id) {
      // Simple permission check: Can only switch to owned teams for now, unless we check membership differently.
      // Actually, if they are ALREADY a member, they are already in it.
      // If they want to SWITCH (meaning change their `team_id`), they must be allowed to join.
      // If they own it, they can join.
      return { success: false, error: "You can only switch to teams you own." };
    }

    await prisma.user.update({
      where: { id: user_id },
      data: { team_id: team_id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to switch team:", error);
    return { success: false, error: "Failed to switch team" };
  }
}

export async function getUserTeams(user_id: string) {
  try {
    // Get teams owned by user
    const ownedTeams = await prisma.team.findMany({
      where: { owner_id: user_id },
    });

    // Get user's current team (even if not owned)
    const currentUser = await prisma.user.findUnique({
      where: { id: user_id },
      include: { team: true },
    });

    const teams = [...ownedTeams];

    if (currentUser?.team) {
      const team = currentUser.team;
      const isAlreadyInList = teams.some((t) => t.id === team.id);
      if (!isAlreadyInList) {
        teams.push(team);
      }
    }

    return teams;
  } catch (error) {
    console.error("Failed to fetch user teams:", error);
    return [];
  }
}
export async function updateTeamColor(
  team_id: string,
  color: string,
  email: string,
) {
  try {
    // Check if team has subscription for this
    const billing = await prisma.user.findUnique({
      where: { email },
    });

    if (!billing || billing.billing_type === "FREE") {
      return {
        success: false,
        error: "Upgrade to PRO to customize team theme.",
      };
    }

    const updatedTeam = await prisma.team.update({
      where: { id: team_id },
      data: { theme_color: color },
    });

    revalidatePath("/dashboard");
    return { success: true, team: updatedTeam };
  } catch (error) {
    console.error("Failed to update team color:", error);
    return { success: false, error: "Failed to update team color" };
  }
}
