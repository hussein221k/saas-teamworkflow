/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback } from "react";

/**
 * Hook for managing team-related state and actions
 * Handles team creation, switching, and invite code management
 */
export function useTeamManagement() {
  // ============================================================================
  // STATE - Team Management
  // ============================================================================
  const [teams, setTeams] = useState<
    {
      id: string;
      name: string;
      owner_id?: string;
      inviteCode?: string | null;
    }[]
  >([]);
  const [formState, setFormState] = useState({
    newTeamName: "",
    isCreating: false,
    isSheetOpen: false,
    activeSheet: false,
    joinCodeInput: "",
    isJoining: false,
  });

  const updateForm = (updates: Partial<typeof formState>) =>
    setFormState((prev) => ({ ...prev, ...updates }));

  // ============================================================================
  // ACTIONS - Team Operations
  // ============================================================================

  /**
   * Reset team creation form
   */
  const resetTeamForm = useCallback(() => {
    updateForm({ newTeamName: "", isSheetOpen: false });
  }, []);

  /**
   * Reset join team form
   */
  const resetJoinForm = useCallback(() => {
    updateForm({ joinCodeInput: "", activeSheet: false });
  }, []);

  return {
    // State
    teams,
    setTeams,
    newTeamName: formState.newTeamName,
    setNewTeamName: (name: string) => updateForm({ newTeamName: name }),
    isCreating: formState.isCreating,
    setIsCreating: (val: boolean) => updateForm({ isCreating: val }),
    isSheetOpen: formState.isSheetOpen,
    setIsSheetOpen: (val: boolean) => updateForm({ isSheetOpen: val }),
    activeSheet: formState.activeSheet,
    setActiveSheet: (val: boolean) => updateForm({ activeSheet: val }),
    joinCodeInput: formState.joinCodeInput,
    setJoinCodeInput: (val: string) => updateForm({ joinCodeInput: val }),
    isJoining: formState.isJoining,
    setIsJoining: (val: boolean) => updateForm({ isJoining: val }),

    // Helpers
    resetTeamForm,
    resetJoinForm,
    updateForm,
  };
}
