import { PlanEnum } from "@/schema/Billing";
import { PLAN_RULES } from "@/config/plan";
import z from "zod";

/**
 * Type inference for Plan from schema
 */
type Plan = z.infer<typeof PlanEnum>;

// ============================================================================
// PLAN GUARD FUNCTIONS
// ============================================================================

/**
 * canUseAI
 * Checks if the given plan allows AI feature usage.
 *
 * @param plan - The subscription plan to check
 * @returns boolean - true if AI features are allowed
 */
export function canUseAI(plan: Plan) {
  return PLAN_RULES[plan].canUseAI;
}

/**
 * canCreateProject
 * Checks if the given plan allows creating more projects.
 *
 * @param plan - The subscription plan to check
 * @param count - Current number of projects
 * @returns boolean - true if project creation is allowed
 */
export function canCreateProject(plan: Plan, count: number) {
  return count < PLAN_RULES[plan].maxProjects;
}

/**
 * canCreateTask
 * Checks if the given plan allows creating more tasks.
 *
 * @param plan - The subscription plan to check
 * @param count - Current number of tasks
 * @returns boolean - true if task creation is allowed
 */
export function canCreateTask(plan: Plan, count: number) {
  return count < PLAN_RULES[plan].maxTasks;
}
