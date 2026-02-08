import { z } from "zod";

export const PlanEnum = z.enum(["FREE", "PRO", "ENTERPRISE"]);
export const BillingStatusEnum = z.enum(["ACTIVE", "EXPIRED", "CANCELED"]);

export const createBillingSchema = z.object({
  teamId: z.number().int(),
  plan: PlanEnum.default("FREE"),
  status: BillingStatusEnum.default("ACTIVE"),
});

export const updateBillingSchema = z.object({
  plan: PlanEnum.optional(),
  status: BillingStatusEnum.optional(),
});
