export const PLAN_RULES = {
  FREE: {
    canUseAI: false,
    maxProjects: 1,
    maxTasks: 20,
  },
  PRO: {
    canUseAI: true,
    maxProjects: Infinity,
    maxTasks: Infinity,
  },
  ENTERPRISE: {
    canUseAI: true,
    maxProjects: Infinity,
    maxTasks: Infinity,
  },
} as const
