/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/lib/prisma";
import { TaskInputSchema } from "@/schema/TaskSchema";
import { getSession } from "@/lib/auth";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Response type for task operations
 */
type TaskResponse<T = unknown> =
  | { success: true; task?: T }
  | { success: false; error: string };

// ============================================================================
// SERVER ACTIONS
// ============================================================================

/**
 * createTask
 * Creates a new task for a team.
 * Validates user authentication and creates the task in the database.
 *
 * @param teamId - The ID of the team to create the task for
 * @param data - Task input data (title, description, status, assignedToId, deadline)
 * @returns TaskResponse with success status and created task or error message
 */
export async function createTask(
  teamId: number,
  data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    assignedToId?: number;
    deadline?: string;
    userId?: string;
  },
) {
  const user = await getSession();

  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || "",
        status: data.status || TaskStatus.PENDING,
        teamId: teamId,
        createdById: user.id,
        assignedToId: data.assignedToId || null,
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, task };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

/**
 * getTeamTasks
 * Retrieves all tasks for a specific team.
 * Includes assigned user information for display purposes.
 *
 * @param teamId - The ID of the team to fetch tasks for
 * @returns TaskResponse with array of tasks or error message
 */
export async function getTeamTasks(teamId: number) {
  try {
    const tasks = await prisma.task.findMany({
      where: { teamId },
      include: {
        assignedTo: { select: { name: true, id: true } },
        createdBy: { select: { name: true, id: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, tasks };
  } catch (error) {
    return { success: false, error: "Failed to fetch tasks" };
  }
}

/**
 * updateTaskStatus
 * Updates the status of a specific task.
 * Revalidates dashboard cache on success.
 *
 * @param taskId - The ID of the task to update
 * @param status - The new status for the task
 * @returns TaskResponse with success status or error message
 */
export async function updateTaskStatus(taskId: number, status: TaskStatus) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}
