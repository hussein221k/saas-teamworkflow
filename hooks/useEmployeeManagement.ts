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
  const [empName, setEmpName] = useState("");
  const [empUsername, setEmpUsername] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [empPass, setEmpPass] = useState("");
  const [isCreatingEmp, setIsCreatingEmp] = useState(false);

  // ============================================================================
  // ACTIONS - Employee Operations
  // ============================================================================
  
  /**
   * Reset employee creation form
   */
  const resetEmployeeForm = useCallback(() => {
    setEmpName("");
    setEmpUsername("");
    setEmpCode("");
    setEmpPass("");
    setIsCreatingEmp(false);
  }, []);

  /**
   * Validate employee form fields
   * @returns true if all required fields are filled
   */
  const validateEmployeeForm = useCallback(() => {
    return empName.trim() && empUsername.trim() && empCode.trim() && empPass.trim();
  }, [empName, empUsername, empCode, empPass]);

  return {
    // State
    empName,
    setEmpName,
    empUsername,
    setEmpUsername,
    empCode,
    setEmpCode,
    empPass,
    setEmpPass,
    isCreatingEmp,
    setIsCreatingEmp,
    
    // Helpers
    resetEmployeeForm,
    validateEmployeeForm,
  };
}
