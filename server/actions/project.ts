"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const ProjectSchema = z.object({
  name: z.string().min(2, "Project identification must be at least 2 characters."),
  teamId: z.number(),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

export async function createProject(data: ProjectInput) {
  const parse = ProjectSchema.safeParse(data);
  if (!parse.success) {
    return { success: false, error: parse.error.issues[0].message };
  }

  const { name, teamId } = parse.data;

  try {
    // Note: In a real app, verify $5 payment here or check credits.
    // For now, we assume the user has "paid" the $5.
    
    const project = await (prisma as any).project.create({
      data: {
        name,
        teamId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "System error during project initialization." };
  }
}

export async function getTeamProjects(teamId: number) {
  try {
    return await (prisma as any).project.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function deleteProject(projectId: number) {
  try {
    await (prisma as any).project.delete({
      where: { id: projectId },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to decommissioning project node." };
  }
}
