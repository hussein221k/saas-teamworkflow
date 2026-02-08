"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { TeamSchema } from "@/schema/TeamSchema";
import { revalidatePath } from "next/cache";
import { secureAction } from "@/lib/security";

const ensureTeam = async (id: number) => {
  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) throw new Error("Cluster not found.");
  return team;
};

export async function createTeam(name: string, ownerId: number) {
  const security = await secureAction();
  if (security.denied) return { success: false, error: security.error };

  try {
    const validatedData = TeamSchema.parse({ name });

    const newTeam = await prisma.team.create({
      data: {
        name: validatedData.name,
        ownerId: ownerId,
        users: {
          connect: { id: ownerId } // Automatically add creator as member
        }
      },
    });

    // Since the User model has a teamId foreign key, connecting the user
    // in the `users` relation above update the user's teamId.
    // However, let's be explicit if needed, but `connect` should handle it for 1-to-many.
    // Actually, in 1-to-many, `users` is the relation back to User.
    // Updating the relation from Team side updates the FK on User side.
    
    revalidatePath("/dashboard");
    return { success: true, team: newTeam };
  } catch (error) {
    console.error("Failed to create team:", error);
    return { success: false, error: "Failed to create team" };
  }
}

export async function updateTeam(teamId: number, name: string) {
  try {
    const validatedData = TeamSchema.parse({ name });

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { name: validatedData.name },
    });

    revalidatePath("/dashboard");
    return { success: true, team: updatedTeam };
  } catch (error) {
    console.error("Failed to update team:", error);
    return { success: false, error: "Failed to update team" };
  }
}

export async function deleteTeam(teamId: number) {
  try {
    await prisma.team.delete({
      where: { id: teamId },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete team:", error);
    return { success: false, error: "Failed to delete team" };
  }
}

export async function getTeamsByOwner(ownerId: number) {
  try {
    const teams = await prisma.team.findMany({
      where: { ownerId },
      include: { _count: { select: { users: true } } },
    });
    return teams;
  } catch (error) {
    console.error("Failed to fetch owned teams:", error);
    return [];
  }
}

export async function getTeamMembers(teamId: number) {
    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { users: true }
        });
        return team?.users || [];
    } catch (error) {
        console.error("Failed to fetch team members:", error);
        return [];
    }
}

export async function removeMemberFromTeam(memberId: number, teamId: number) {
    try {
        // Validation: Check if the user trying to kick is the admin (should be done in UI-calling action, but here for safety)
        // For simplicity, we just set teamId to null if the member is not the owner
        const team = await ensureTeam(teamId);
        if (team.ownerId === memberId) return { success: false, error: "Owner cannot be expelled from their own cluster." };

        await prisma.user.update({
            where: { id: memberId },
            data: { teamId: null }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Kick failure:", error);
        return { success: false, error: "Decommissioning protocol failed." };
    }
}

export async function generateTeamInvite(teamId: number) {
    try {
        const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        await (prisma.team as any).update({
            where: { id: teamId },
            data: { inviteCode }
        });
        revalidatePath("/dashboard");
        return { success: true, code: inviteCode };
    } catch (error) {
        return { success: false, error: "Neural link generation failed." };
    }
}

export async function joinTeamByCode(userId: number, code: string) {
    const security = await secureAction();
    if (security.denied) return { success: false, error: security.error };

    const inviteCode = code.trim().toUpperCase();
    if (!inviteCode) return { success: false, error: "Invalid protocol string." };

    try {
        const team = await (prisma.team as any).findUnique({
            where: { inviteCode }
        });

        if (!team) return { success: false, error: "Signal lost: Cluster identity not found." };

        await prisma.user.update({
            where: { id: userId },
            data: { teamId: team.id }
        });

        revalidatePath("/dashboard");
        return { success: true, teamId: team.id };
    } catch (error) {
        return { success: false, error: "Synchronization error." };
    }
}

export async function switchTeam(userId: number, teamId: number) {
  try {
    const team = await ensureTeam(teamId);

    if (team.ownerId !== userId) {
        // Simple permission check: Can only switch to owned teams for now, unless we check membership differently.
        // Actually, if they are ALREADY a member, they are already in it.
        // If they want to SWITCH (meaning change their `teamId`), they must be allowed to join.
        // If they own it, they can join.
        return { success: false, error: "You can only switch to teams you own." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { teamId },
    });
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to switch team:", error);
    return { success: false, error: "Failed to switch team" };
  }
}

export async function getUserTeams(userId: number) {
  try {
    // Get teams owned by user
    const ownedTeams = await prisma.team.findMany({
      where: { ownerId: userId },
    });
    
    // Get user's current team (even if not owned)
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { team: true }
    });

    const teams = [...ownedTeams];
    
    if (currentUser?.team) {
        const team = currentUser.team;
        const isAlreadyInList = teams.some(t => t.id === team.id);
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
export async function updateTeamColor(teamId: number, color: string) {
  try {
    // Check if team has subscription for this
    const billing = await prisma.billing.findUnique({
        where: { teamId }
    });

    if (!billing || billing.plan === "FREE") {
        return { success: false, error: "Upgrade to PRO to customize team theme." };
    }

    const updatedTeam = await (prisma.team as any).update({
      where: { id: teamId },
      data: { themeColor: color },
    });

    revalidatePath("/dashboard");
    return { success: true, team: updatedTeam };
  } catch (error) {
    console.error("Failed to update team color:", error);
    return { success: false, error: "Failed to update team color" };
  }
}
