// ============================================================================
// PLAN CONFIGURATION
// ============================================================================

/**
 * PLAN_RULES
 * Defines feature limits and capabilities for each subscription plan.
 *
 * Structure:
 * - FREE: Basic access with limited features
 * - PRO: Full access with unlimited projects and tasks
 * - ENTERPRISE: Full access with additional enterprise features
 */
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
} as const;
