import z from "zod";

// ============================================================================
// COMMENT SCHEMA
// ============================================================================

/**
 * CommentSchema
 * Validation schema for task comments
 */
export const CommentSchema = z.object({
  id:z.string().uuid(),
  /**
   * Comment content - required string with max 1000 characters
   */
  content: z.string().min(1).max(1000),

  /**
   * ID of the task this comment belongs to
   */
  task_id: z.string(),

  /**
   * ID of the user who created the comment
   */
  user_id: z.string(),
});

/**
 * Inferred TypeScript type from CommentSchema
 */
export type Comment = z.infer<typeof CommentSchema>;
