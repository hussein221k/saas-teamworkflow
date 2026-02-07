import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE", "OVERDUE"]),
  deadline: z.coerce.date().optional(),
  assignedToId: z.string().optional(),
  userId: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;
