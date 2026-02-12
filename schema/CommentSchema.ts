import z from "zod";

// ============================================================================
// COMMENT SCHEMA
// ============================================================================

/**
 * CommentSchema
 * Validation schema for task comments
 */
export const CommentSchema = z.object({
  /**
   * Comment content - required string with max 1000 characters
   */
  content: z.string().min(1).max(1000),

  /**
   * ID of the task this comment belongs to
   */
  taskId: z.number().int(),

  /**
   * ID of the user who created the comment
   */
  userId: z.number().int(),
});

/**
 * Inferred TypeScript type from CommentSchema
 */
export type Comment = z.infer<typeof CommentSchema>;
