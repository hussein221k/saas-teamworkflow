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

  userId: z.number(),
  createdAt: z.date(),
  /**
   * Team ID - must be a positive integer
   */
  teamId: z.number().int().positive("Team ID must be a valid number"),
  id: z.number(),
  channelId: z.number().nullable(),
  user: z
    .object({
      name: z.string().nullable(),
      email: z.string().nullable(),
    })
    .optional(),
});

export type Message = z.infer<typeof MessageSchema>;
