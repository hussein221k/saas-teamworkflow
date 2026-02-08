import { z } from "zod";

export const MessageSchema = z.object({
  content: z.string().min(1, "Message content cannot be empty"),
  teamId: z.number().int().positive("Team ID must be a valid number"),
});
