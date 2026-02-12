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
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // ============================================================================
  // ACTIONS - Project Operations
  // ============================================================================
  
  /**
   * Reset project creation form
   */
  const resetProjectForm = useCallback(() => {
    setNewProjectName("");
    setIsCreatingProject(false);
  }, []);

  return {
    // State
    newProjectName,
    setNewProjectName,
    isCreatingProject,
    setIsCreatingProject,
    
    // Helpers
    resetProjectForm,
  };
}
