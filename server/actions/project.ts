"use server";

import { prisma } from "@/lib/prisma";
import { ProjectInput, ProjectSchema } from "@/schema/Project";
import { revalidatePath } from "next/cache";

export async function createProject(data: ProjectInput) {
  const parse = ProjectSchema.safeParse(data);
  if (!parse.success) {
    return { success: false, error: parse.error.issues[0].message };
  }

  const { name, team_id } = parse.data;

  try {
    // Note: In a real app, verify $5 payment here or check credits.
    // For now, we assume the user has "paid" the $5.

    const project = await prisma.project.create({
      data: {
        name,
        team_id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      success: false,
      error: "System error during project initialization.",
    };
  }
}

export async function getTeamProjects(team_id: string) {
  try {
    return await prisma.project.findMany({
      where: { team_id },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({
      where: { id: projectId },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to decommissioning project node." };
  }
}
