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
  const [activeSheet, setActiveSheet] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // ============================================================================
  // ACTIONS - Channel Operations
  // ============================================================================

  /**
   * Reset channel creation form
   */
  const resetChannelForm = useCallback(() => {
    setNewGroupName("");
    setActiveSheet(false);
  }, []);

  return {
    // State
    activeSheet,
    setActiveSheet,
    newGroupName,
    setNewGroupName,

    // Helpers
    resetChannelForm,
  };
}
