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
    { id: number; name: string; ownerId?: number; inviteCode?: string | null }[]
  >([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Join team state
  const [activeSheet, setactiveSheet] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // ============================================================================
  // ACTIONS - Team Operations
  // ============================================================================

  /**
   * Reset team creation form
   */
  const resetTeamForm = useCallback(() => {
    setNewTeamName("");
    setIsSheetOpen(false);
  }, []);

  /**
   * Reset join team form
   */
  const resetJoinForm = useCallback(() => {
    setJoinCodeInput("");
    setactiveSheet(false);
  }, []);

  return {
    // State
    teams,
    setTeams,
    newTeamName,
    setNewTeamName,
    isCreating,
    setIsCreating,
    isSheetOpen,
    setIsSheetOpen,
    activeSheet,
    setactiveSheet,
    joinCodeInput,
    setJoinCodeInput,
    isJoining,
    setIsJoining,

    // Helpers
    resetTeamForm,
    resetJoinForm,
  };
}
