import z from "zod";

export const CommentSchema = z.object({
  content: z.string().min(1).max(1000),
  taskId: z.number().int(),
  userId: z.number().int(),
});

export type Comment = z.infer<typeof CommentSchema>;
