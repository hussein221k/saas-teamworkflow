import { z } from "zod";

// ============================================================================
// BILLING SCHEMAS
// ============================================================================

/**
 * PlanEnum
 * Subscription plan types available in the application
 */
export const PlanEnum = z.enum(["FREE", "PRO", "ENTERPRISE"]);

/**
 * BillingStatusEnum
 * Status of a billing subscription
 */
export const BillingStatusEnum = z.enum(["ACTIVE", "EXPIRED", "CANCELED"]);

/**
 * createBillingSchema
 * Schema for creating a new billing record
 */
export const createBillingSchema = z.object({
  teamId: z.number().int(),
  plan: PlanEnum.default("FREE"),
  status: BillingStatusEnum.default("ACTIVE"),
});

/**
 * updateBillingSchema
 * Schema for updating an existing billing record
 */
export const updateBillingSchema = z.object({
  plan: PlanEnum.optional(),
  status: BillingStatusEnum.optional(),
});
