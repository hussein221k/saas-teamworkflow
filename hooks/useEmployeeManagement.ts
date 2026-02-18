"use client";

import { useState, useCallback } from "react";

/**
 * Hook for managing employee-related state
 * Handles employee creation and form management
 */
export function useEmployeeManagement() {
  // ============================================================================
  // STATE - Employee Form Fields
  // ============================================================================
  const [state, setState] = useState({
    empName: "",
    empUsername: "",
    empCode: "",
    empPass: "",
    isCreatingEmp: false,
  });

  const updateState = (updates: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...updates }));

  // ============================================================================
  // ACTIONS - Employee Operations
  // ============================================================================
  
  /**
   * Reset employee creation form
   */
  const resetEmployeeForm = useCallback(() => {
    updateState({
      empName: "",
      empUsername: "",
      empCode: "",
      empPass: "",
      isCreatingEmp: false,
    });
  }, []);

  /**
   * Validate employee form fields
   * @returns true if all required fields are filled
   */
  const validateEmployeeForm = useCallback(() => {
    return (
      state.empName.trim() &&
      state.empUsername.trim() &&
      state.empCode.trim() &&
      state.empPass.trim()
    );
  }, [state.empName, state.empUsername, state.empCode, state.empPass]);

  return {
    // State
    empName: state.empName,
    setEmpName: (val: string) => updateState({ empName: val }),
    empUsername: state.empUsername,
    setEmpUsername: (val: string) => updateState({ empUsername: val }),
    empCode: state.empCode,
    setEmpCode: (val: string) => updateState({ empCode: val }),
    empPass: state.empPass,
    setEmpPass: (val: string) => updateState({ empPass: val }),
    isCreatingEmp: state.isCreatingEmp,
    setIsCreatingEmp: (val: boolean) => updateState({ isCreatingEmp: val }),

    // Helpers
    resetEmployeeForm,
    validateEmployeeForm,
    updateState,
  };
}
