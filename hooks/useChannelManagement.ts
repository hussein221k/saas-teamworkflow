"use client";

import { useState, useCallback } from "react";

/**
 * Hook for managing channel-related state
 * Handles channel creation and navigation
 */
export function useChannelManagement() {
  // ============================================================================
  // STATE - Channel Management
  // ============================================================================
  const [state, setState] = useState({
    activeSheet: false,
    newGroupName: "",
  });

  const updateState = (updates: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...updates }));

  // ============================================================================
  // ACTIONS - Channel Operations
  // ============================================================================

  /**
   * Reset channel creation form
   */
  const resetChannelForm = useCallback(() => {
    updateState({ newGroupName: "", activeSheet: false });
  }, []);

  return {
    // State
    activeSheet: state.activeSheet,
    setActiveSheet: (val: boolean) => updateState({ activeSheet: val }),
    newGroupName: state.newGroupName,
    setNewGroupName: (name: string) => updateState({ newGroupName: name }),

    // Helpers
    resetChannelForm,
  };
}
