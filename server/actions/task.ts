"use server";

import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
  assignedToId: z.number().optional().nullable(),
  deadline: z.string().optional().nullable(),
});

export async function createTask(teamId: number, data: z.infer<typeof TaskSchema>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) return { success: false, error: "Unauthorized" };

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) return { success: false, error: "User not found" };

  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || "",
        status: data.status,
        teamId: teamId,
        createdById: dbUser.id,
        assignedToId: data.assignedToId,
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
