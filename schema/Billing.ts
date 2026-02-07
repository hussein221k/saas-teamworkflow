import { z } from "zod";

export const createBillingSchema = z.object({
  teamId: z.number().int(),
  plan: z.enum(["FREE", "PRO", "ENTERPRISE"]),
});

export const updateBillingSchema = z.object({
  plan: z.enum(["FREE", "PRO", "ENTERPRISE"]).optional(),
  status: z.enum(["ACTIVE", "EXPIRED", "CANCELED"]).optional(),
});
