import { z } from "zod";

/**
 * TaskSchema
 * Validation schema for task-related operations.
 * Defines the structure and validation rules for task data.
 */

export const TaskSchema = z.object({
  /**
   * Task ID - numeric identifier from database
   */
  id: z.number().int(),

  /**
   * Task title - required string
   */
  title: z.string(),

  /**
   * Task description - optional string
   */
  description: z.string(),

  /**
   * Current status of the task
   */
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE", "OVERDUE"]),

  /**
   * Optional deadline date
   */
  deadline: z.coerce.date().optional(),

  /**
   * Optional assigned user ID - can be null or undefined
   */
  assignedToId: z.number().int().nullable().optional(),

  /**
   * Creator user ID - numeric string
   */
  userId: z.string(),
});

/**
 * TaskInputSchema
 * Schema for creating new tasks - excludes database-generated fields
 */
export const TaskInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z
    .enum(["PENDING", "IN_PROGRESS", "DONE", "OVERDUE"])
    .default("PENDING"),
  assignedToId: z.number().int().optional(),
  deadline: z.coerce.date().optional(),
});

/**
 * TaskStatusUpdateSchema
 * Schema for updating task status
 */
export const TaskStatusUpdateSchema = z.object({
  taskId: z.number().int(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE", "OVERDUE"]),
});

/**
 * Inferred TypeScript type from TaskSchema
 */
export type Task = z.infer<typeof TaskSchema>;

/**
 * Inferred TypeScript type from TaskInputSchema
 */
export type TaskInput = z.infer<typeof TaskInputSchema>;
