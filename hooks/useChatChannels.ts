"use client";

import { Channel } from '@/schema/ChannelSchema';
import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ============================================================================
// SERVER ACTIONS - Import all backend operations
// ============================================================================
import {
  createTeam,
  switchTeam,
  getTeamMembers,
  generateTeamInvite,
  joinTeamByCode,
  removeMemberFromTeam,
} from "@/server/actions/team";
import { createChannel, getTeamChannels } from "@/server/actions/channel";
import {
  createProject,
  getTeamProjects,
  deleteProject,
} from "@/server/actions/project";
import { createEmployee, deleteEmployee } from "@/server/actions/employee";

// ============================================================================
// SUB-HOOKS - Import focused state management hooks
// ============================================================================
import { useTeamManagement } from "./useTeamManagement";
import { useChannelManagement } from "./useChannelManagement";
import { useProjectManagement } from "./useProjectManagement";
import { useEmployeeManagement } from "./useEmployeeManagement";

// ============================================================================
// TYPES
// ============================================================================


/**
 * Main hook for managing chat channels, teams, projects, and employees
 * Orchestrates multiple sub-hooks for better organization and readability
 *
 * @param user_id - Current user ID
 * @param team_id - Active team ID
 * @param initialTeams - Initial list of teams user belongs to
 * @param isAdmin - Whether user has admin privileges
 */
export function useChatChannels({
  user_id,
  team_id,
}: Channel) {
  // ============================================================================
  // UI STATE - General interface state
  // ============================================================================
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // ============================================================================
  // SUB-HOOKS - Delegate state management to focused hooks
  // ============================================================================
  const teamState = useTeamManagement();
  const channelState = useChannelManagement();
  const projectState = useProjectManagement();
  const employeeState = useEmployeeManagement();

  // ============================================================================
  // ROUTER & NAVIGATION - URL and routing management
  // ============================================================================
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Extract active channel from URL
  const activeChannelIdStr = searchParams.get("channel_id");
  const activeChannelId = activeChannelIdStr;

  /**
   * Navigate to a specific channel or clear channel selection
   * Updates URL params without full page reload
   */
  const navigateToChannel = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("channel_id", id.toString());
      } else {
        params.delete("channel_id");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  // ============================================================================
  // DATA QUERIES - Fetch data from server with caching
  // ============================================================================

  /**
   * Fetch team members with 10-minute cache
   */
  const { data: members = [] } = useQuery({
    queryKey: ["members", team_id],
    queryFn: () => getTeamMembers(team_id),
    enabled: !!team_id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  /**
   * Fetch team channels
   */
  const { data: channels = [], refetch: refetchChannels } = useQuery({
    queryKey: ["channels", team_id],
    queryFn: async () => {
      const res = await getTeamChannels(team_id);
      return res.channels || [];
    },
    enabled: !!team_id,
  });

  /**
   * Fetch team projects
   */
  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ["projects", team_id],
    queryFn: async () => {
      return await getTeamProjects(team_id);
    },
    enabled: !!team_id,
  });

  // ============================================================================
  // UTILITIES - Helper functions and constants
  // ============================================================================

  /**
   * Color palette for UI elements
   */
  const colors = useMemo(
    () => [
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-violet-600",
      "bg-amber-600",
      "bg-rose-600",
      "bg-blue-600",
    ],
    [],
  );

  // ============================================================================
  // TEAM ACTIONS - Team management operations
  // ============================================================================

  /**
   * Create a new team
   * Adds team to local state and refreshes the page
   */
  const handleCreateTeam = useCallback(async () => {
    if (!teamState.newTeamName.trim()) return;

    teamState.setIsCreating(true);
    try {
      const result = await createTeam(teamState.newTeamName, user_id);
      if (result.success && result.team) {
        teamState.setTeams((prev) => [...prev, result.team!]);
        teamState.resetTeamForm();
        toast.success("Team synchronized.");
        router.refresh();
      } else {
        toast.error(result.error || "Integration failure");
      }
    } finally {
      teamState.setIsCreating(false);
    }
  }, [teamState, user_id, router]);

  /**
   * Switch to a different team
   * Triggers full page refresh to load new team data
   */
  const handleSwitchTeam = useCallback(
    async (team_id: string) => {
      const result = await switchTeam(user_id, team_id);
      if (result.success) {
        toast.success("Neural link established");
        router.refresh();
      } else {
        toast.error(result.error || "Synchronization failed");
      }
    },
    [user_id, router],
  );

  /**
   * Generate invite code for current team
   * Returns the generated code or null on failure
   */
  const handleGenerateInvite = useCallback(async () => {
    const result = await generateTeamInvite(team_id);
    if (result.success && result.code) {
      toast.success("Invite code generated");
      return result.code;
    } else {
      toast.error(result.error || "Generation failed");
      return null;
    }
  }, [team_id]);

  /**
   * Join a team using invite code
   * Refreshes page on success to load new team
   */
  const handleJoinTeam = useCallback(async () => {
    if (!teamState.joinCodeInput.trim()) return;

    teamState.setIsJoining(true);
    try {
      const result = await joinTeamByCode(user_id, teamState.joinCodeInput);
      if (result.success) {
        teamState.resetJoinForm();
        toast.success("Neural link established");
        router.refresh();
      } else {
        toast.error(result.error || "Join failed");
      }
    } finally {
      teamState.setIsJoining(false);
    }
  }, [teamState, user_id, router]);

  // ============================================================================
  // CHANNEL ACTIONS - Channel management operations
  // ============================================================================

  /**
   * Create a new channel in current team
   * Refreshes channel list on success
   */
  const handleCreateChannel = useCallback(async () => {
    if (!channelState.newGroupName.trim()) return;

    const result = await createChannel(
      team_id,
      channelState.newGroupName,
    );
    if (result.success) {
      channelState.resetChannelForm();
      toast.success("Channel node established");
      refetchChannels();
    } else {
      toast.error(result.error || "Channel creation failed");
    }
  }, [channelState, team_id, refetchChannels]);

  // ============================================================================
  // PROJECT ACTIONS - Project management operations
  // ============================================================================

  /**
   * Create a new project in current team
   * Refreshes project list on success
   */
  const handleCreateProject = useCallback(async () => {
    if (!projectState.newProjectName.trim()) return;

    projectState.setIsCreatingProject(true);
    try {
      const result = await createProject({
        name: projectState.newProjectName,
        team_id: team_id,
      });
      if (result.success) {
        projectState.resetProjectForm();
        toast.success("Project initialized");
        refetchProjects();
      } else {
        toast.error(result.error || "Project creation failed");
      }
    } finally {
      projectState.setIsCreatingProject(false);
    }
  }, [projectState, team_id, refetchProjects]);

  /**
   * Delete a project by ID
   * Refreshes project list on success
   */
  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      const result = await deleteProject(projectId);
      if (result.success) {
        toast.success("Project terminated");
        refetchProjects();
      } else {
        toast.error(result.error || "Deletion failed");
      }
    },
    [refetchProjects],
  );

  // ============================================================================
  // EMPLOYEE ACTIONS - Employee management operations
  // ============================================================================

  /**
   * Create a new employee
   * Validates form and invalidates member cache on success
   */
  const handleCreateEmployee = useCallback(async () => {
    if (!employeeState.validateEmployeeForm()) {
      toast.error("All fields required");
      return;
    }

    employeeState.setIsCreatingEmp(true);
    try {
      const result = await createEmployee({
        name: employeeState.empName,
        username: employeeState.empUsername,
        employee_code: employeeState.empCode,
        password: employeeState.empPass,
      });

      if (result.success) {
        employeeState.resetEmployeeForm();
        toast.success("Unit synchronized");
        queryClient.invalidateQueries({
          queryKey: ["members", team_id],
        });
      } else {
        toast.error(result.error || "Sync failed");
      }
    } finally {
      employeeState.setIsCreatingEmp(false);
    }
  }, [employeeState, team_id, queryClient]);

  /**
   * Delete an employee by ID
   * Invalidates member cache on success
   */
  const handleDeleteEmployee = useCallback(
    async (employeeId: string) => {
      const result = await deleteEmployee(employeeId);
      if (result.success) {
        toast.success("Unit deactivated");
        queryClient.invalidateQueries({
          queryKey: ["members", team_id],
        });
      } else {
        toast.error(result.error || "Deactivation failed");
      }
    },
    [team_id, queryClient],
  );

  /**
   * Remove a member from current team
   * Invalidates member cache on success
   */
  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      const result = await removeMemberFromTeam(memberId, team_id);
      if (result.success) {
        toast.success("Member removed");
        queryClient.invalidateQueries({
          queryKey: ["members", team_id],
        });
      } else {
        toast.error(result.error || "Removal failed");
      }
    },
    [team_id, queryClient],
  );

  // ============================================================================
  // RETURN - Expose all state and actions
  // ============================================================================
  return {
    // General UI State
    isOpen,
    setIsOpen,
    isAdminPanelOpen,
    setIsAdminPanelOpen,

    // Team State (from useTeamManagement)
    teams: teamState.teams,
    setTeams: teamState.setTeams,
    newTeamName: teamState.newTeamName,
    setNewTeamName: teamState.setNewTeamName,
    isCreating: teamState.isCreating,
    isSheetOpen: teamState.isSheetOpen,
    setIsSheetOpen: teamState.setIsSheetOpen,
    activeSheet: teamState.activeSheet,
    setactiveSheet: teamState.setactiveSheet,
    joinCodeInput: teamState.joinCodeInput,
    setJoinCodeInput: teamState.setJoinCodeInput,
    isJoining: teamState.isJoining,

    // Channel State (from useChannelManagement)
    activeChannelSheet: channelState.activeSheet,
    setActiveSheet: channelState.setActiveSheet,
    newGroupName: channelState.newGroupName,
    setNewGroupName: channelState.setNewGroupName,

    // Project State (from useProjectManagement)
    newProjectName: projectState.newProjectName,
    setNewProjectName: projectState.setNewProjectName,
    isCreatingProject: projectState.isCreatingProject,

    // Employee State (from useEmployeeManagement)
    empName: employeeState.empName,
    setEmpName: employeeState.setEmpName,
    empUsername: employeeState.empUsername,
    setEmpUsername: employeeState.setEmpUsername,
    empCode: employeeState.empCode,
    setEmpCode: employeeState.setEmpCode,
    empPass: employeeState.empPass,
    setEmpPass: employeeState.setEmpPass,
    isCreatingEmp: employeeState.isCreatingEmp,

    // Data from Queries
    members,
    channels,
    projects,
    colors,
    activeChannelId,

    // Actions
    navigateToChannel,
    handleCreateTeam,
    handleSwitchTeam,
    handleCreateChannel,
    handleCreateProject,
    handleDeleteProject,
    handleCreateEmployee,
    handleDeleteEmployee,
    handleRemoveMember,
    handleGenerateInvite,
    handleJoinTeam,
    refetchChannels,
    refetchProjects,
  };
}
