/**
 * Hooks Index
 * Central export point for all custom React hooks
 *
 * Organization:
 * - Dashboard hooks: Chat, tasks, channels management
 * - Utility hooks: Mobile detection, etc.
 */

// ============================================================================
// DASHBOARD HOOKS - Main application features
// ============================================================================

/**
 * Main orchestrator hook for chat channels
 * Combines team, channel, project, and employee management
 */
export { useChatChannels } from "./useChatChannels";

/**
 * Chat messaging functionality
 * Handles message sending and real-time updates
 */
export { useChat } from "./useChat";

/**
 * Task management
 * Create, update, and track team tasks
 */
export { useTasks } from "./useTasks";

// ============================================================================
// USER & SESSION HOOKS
// ============================================================================

/**
 * User session management
 * Fetches and manages current user session data
 */
export { useUser, useUserById } from "./useUser";

// ============================================================================
// TEAM HOOKS
// ============================================================================

/**
 * Team data management
 * Fetches teams and team details via API routes
 */
export { useUserTeams, useTeam, useCurrentTeam } from "./useTeam";

/**
 * Team management state
 * Team creation, switching, and invite codes
 */
export { useTeamManagement } from "./useTeamManagement";

// ============================================================================
// BILLING HOOKS
// ============================================================================

/**
 * Billing information management
 * Fetches and manages billing data via API routes
 */
export { useBilling, useBillingByTeamId } from "./useBilling";

// ============================================================================
// SUB-HOOKS - Focused state management
// ============================================================================

/**
 * Channel management state
 * Channel creation and navigation
 */
export { useChannelManagement } from "./useChannelManagement";

/**
 * Project management state
 * Project creation and deletion
 */
export { useProjectManagement } from "./useProjectManagement";

/**
 * Employee management state
 * Employee creation and form handling
 */
export { useEmployeeManagement } from "./useEmployeeManagement";

// ============================================================================
// UTILITY HOOKS - General purpose utilities
// ============================================================================

/**
 * Mobile device detection
 * Returns boolean indicating if viewport is mobile size
 */
export { useIsMobile } from "./use-mobile";
