"use client";

import { User } from "@/schema/UserSchema";
import { useQuery } from "@tanstack/react-query";



/**
 * Session response from API
 */
export interface SessionResponse {
  user: User | null;
  isAdmin: boolean;
  error?: string;
}

// ============================================================================
// HOOK DEFINITION
// ============================================================================

/**
 * useUser Hook
 * Fetches and manages the current user's session data.
 * Uses the existing /api/auth/session endpoint.
 *
 * @returns Object with user data, loading state, and refetch function
 */
export function useUser() {
  const {
    data: sessionData,
    isLoading,
    refetch,
  } = useQuery<SessionResponse>({
    queryKey: ["user", "session"],
    queryFn: async () => {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const user = sessionData?.user ?? null;
  const isAdmin = sessionData?.isAdmin ?? false;

  return {
    user,
    isAdmin,
    isLoading,
    isAuthenticated: !!user,
    refreshUser: refetch,
  };
}

/**
 * useUserById Hook
 * Fetches user data by user ID
 *
 * @param userId - The ID of the user to fetch
 * @returns Object with user data and loading state
 */
export function useUserById(userId: string | null) {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data.user;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    user,
    isLoading,
    refreshUser: refetch,
  };
}
