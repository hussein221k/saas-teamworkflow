/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback } from "react";

/**
 * Hook for managing project-related state
 * Handles project creation and deletion
 */
export function useProjectManagement() {
  // ============================================================================
  // STATE - Project Management
  // ============================================================================
  const [state, setState] = useState({
    newProjectName: "",
    isCreatingProject: false,
  });

  const updateState = (updates: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...updates }));

  // ============================================================================
  // ACTIONS - Project Operations
  // ============================================================================
  
  /**
   * Reset project creation form
   */
  const resetProjectForm = useCallback(() => {
    updateState({ newProjectName: "", isCreatingProject: false });
  }, []);

  return {
    // State
    newProjectName: state.newProjectName,
    setNewProjectName: (name: string) => updateState({ newProjectName: name }),
    isCreatingProject: state.isCreatingProject,
    setIsCreatingProject: (val: boolean) => updateState({ isCreatingProject: val }),
    
    // Helpers
    resetProjectForm,
  };
}
