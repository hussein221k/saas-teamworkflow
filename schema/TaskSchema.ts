import { task_status } from "@prisma/client";
import { z } from "zod";

// Enum corresponding to your Prisma enum
export const taskSchema = z.object({
  id: z.string().uuid(), // auto-incremented
  title: z.string(),
  description: z.string(),
  status: z.enum(task_status), // default: PENDING
  deadline: z.coerce.date().optional(),

  team_id: z.string(), // provided by server
  created_by_id: z.string(), // provided by server
  assigned_to_id: z.string(),

  created_at: z.date().optional(), // default: now()
  updated_at: z.date().optional(), // updatedAt handled by Prisma
});
export type Task = z.infer<typeof taskSchema>;
