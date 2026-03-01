import { z } from "zod";

// ============================================================================
// TEAM SCHEMA
// ============================================================================

/**
 * TeamSchema
 * Validation schema for team data
 */
export const TeamSchema = z.object({
  id: z.string().uuid(),
  /**
   * Team name - minimum 2 characters
   */
  name: z.string().min(2, "Team name is Short"),

  /**
   * Owner ID - numeric identifier for the team admin
   */
  owner_id: z.string().uuid(), //Admin User

  theme_color: z.string().optional(),
  invite_code: z.string().nullable().optional(),
});

/**
 * Inferred TypeScript type from TeamSchema
 */
export type Team = z.infer<typeof TeamSchema>;
