import { z } from "zod";

// ============================================================================
// PROJECT SCHEMA
// ============================================================================

/**
 * ProjectSchema
 * Validation schema for project data
 */
export const ProjectSchema = z.object({
  /**
   * Project name - minimum 2 characters
   */
  name: z
    .string()
    .min(2, "Project identification must be at least 2 characters."),

  /**
   * Team ID - numeric identifier
   */
  teamId: z.number(),
});

/**
 * Inferred TypeScript type from ProjectSchema
 */
export type ProjectInput = z.infer<typeof ProjectSchema>;
