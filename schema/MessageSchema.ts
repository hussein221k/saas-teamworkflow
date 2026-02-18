import { z } from "zod";

// ============================================================================
// MESSAGE SCHEMA
// ============================================================================

/**
 * MessageSchema
 * Validation schema for chat messages
 */
export const MessageSchema = z.object({
  /**
   * Message content - required, cannot be empty
   */
  content: z.string().min(1, "Message content cannot be empty"),

  user_id: z.string().optional(),
  created_at: z.date().optional(),
  /**
   * Team ID - must be a positive integer
   */
  team_id: z.string(),
  id: z.string().optional(),
  channel_id: z.string().optional().nullable(),
  user: z
    .object({
      name: z.string(),
      email: z.string().optional(),
    })
    .optional(),
});

export type Message = z.infer<typeof MessageSchema>;
