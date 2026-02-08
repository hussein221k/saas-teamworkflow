import { PlanEnum } from "@/schema/Billing"
import { PLAN_RULES } from "@/config/plan"
import z from "zod"

type Plan = z.infer<typeof PlanEnum>

export function canUseAI(plan: Plan) {
  return PLAN_RULES[plan].canUseAI
}

export function canCreateProject(plan: Plan, count: number) {
  return count < PLAN_RULES[plan].maxProjects
}

export function canCreateTask(plan: Plan, count: number) {
  return count < PLAN_RULES[plan].maxTasks
}
