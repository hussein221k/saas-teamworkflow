"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback } from "react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Team data interface
 */
export interface Team {
  id: string;
  name: string;
  owner_id: string;
  theme_color: string;
  invite_code: string | null;
  created_at: Date;
}

/**
 * Team with members and billing
 */
export interface TeamWithDetails extends Team {
  billing?: {
    id: string;
    plan: "FREE" | "PRO" | "ENTERPRISE";
    status: "ACTIVE" | "EXPIRED" | "CANCELED";
    started_at: Date;
    ends_at: Date | null;
  } | null;
  users?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "EMPLOYEE";
  }[];
}

/**
 * Teams response from API
 */
export interface TeamsResponse {
  teams: Team[];
  isAdmin: boolean;
}

// ============================================================================
// HOOK DEFINITIONS
// ============================================================================

/**
 * useUserTeams Hook
 * Fetches all teams for the current user (owned teams + current team)
 *
 * @returns Object with teams, loading state, and refetch function
 */
export function useUserTeams() {
  const {
    data: teamsData,
    isLoading,
    refetch,
  } = useQuery<TeamsResponse>({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await fetch("/api/team");
      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    teams: teamsData?.teams ?? [],
    isAdmin: teamsData?.isAdmin ?? false,
    isLoading,
    refreshTeams: refetch,
  };
}

/**
 * useTeam Hook
 * Fetches a specific team by ID with all details
 *
 * @param teamId - The ID of the team to fetch
 * @returns Object with team data, loading state, and refetch function
 */
export function useTeam(teamId: string | null) {
  const {
    data: teamData,
    isLoading,
    refetch,
  } = useQuery<{ team: TeamWithDetails }>({
    queryKey: ["team", teamId],
    queryFn: async () => {
      if (!teamId) throw new Error("Team ID is required");
      const response = await fetch(`/api/team/${teamId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch team");
      }
      return response.json();
    },
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    team: teamData?.team ?? null,
    isLoading,
    refreshTeam: refetch,
  };
}

/**
 * useCurrentTeam Hook
 * Convenience hook that gets the current team from user teams
 * Prefers the first owned team, falls back to the first team in list
 *
 * @param teams - Array of teams from useUserTeams
 * @returns The current team or null
 */
export function useCurrentTeam(teams: Team[]): Team | null {
  if (!teams || teams.length === 0) return null;

  // Prefer owned team (first one where user is owner)
  return teams[0];
}
