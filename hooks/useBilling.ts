"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback } from "react";

// Local enum definitions to avoid importing @prisma/client in client components
const plan = {
  FREE: "FREE",
  PRO: "PRO",
  ENTERPRISE: "ENTERPRISE",
} as const;

const billing_status = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELLED: "CANCELLED",
} as const;

export type Plan = (typeof plan)[keyof typeof plan];
export type BillingStatus =
  (typeof billing_status)[keyof typeof billing_status];

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Billing info from API
 */
export interface BillingInfo {
  team_id: string;
  team_name: string | null;
  billing_type: Plan;
  billing_status: BillingStatus;
  billing_started: Date | null;
  billing_ends: Date | null;
  is_billing: boolean;
}

// ============================================================================
// HOOK DEFINITIONS
// ============================================================================

/**
 * useBilling Hook
 * Fetches billing information for the current user's team
 * Only works for admin users
 *
 * @returns Object with billing data, loading state, and refetch function
 */
export function useBilling() {
  const queryClient = useQueryClient();

  const {
    data: billingData,
    isLoading,
    refetch,
    isError,
  } = useQuery<BillingInfo>({
    queryKey: ["billing"],
    queryFn: async () => {
      const response = await fetch("/api/billing");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch billing info");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const upgradePlanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/billing/upgrade", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to upgrade plan");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Plan upgraded successfully!");
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upgrade plan");
    },
  });

  const downgradePlanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/billing/downgrade", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to downgrade plan");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Plan downgraded successfully!");
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to downgrade plan");
    },
  });

  /**
   * Upgrade the team plan
   */
  const upgradePlan = useCallback(async () => {
    return upgradePlanMutation.mutateAsync();
  }, [upgradePlanMutation]);

  /**
   * Downgrade the team plan
   */
  const downgradePlan = useCallback(async () => {
    return downgradePlanMutation.mutateAsync();
  }, [downgradePlanMutation]);

  return {
    billing: billingData ?? null,
    isLoading,
    isError,
    refreshBilling: refetch,
    upgradePlan,
    downgradePlan,
    isUpgrading: upgradePlanMutation.isPending,
    isDowngrading: downgradePlanMutation.isPending,
    isPro: billingData?.billing_type === "PRO",
    isEnterprise: billingData?.billing_type === "ENTERPRISE",
    isFree: billingData?.billing_type === "FREE",
  };
}

/**
 * useBillingByTeamId Hook
 * Fetches billing info for a specific team (admin only)
 *
 * @param teamId - The team ID to fetch billing for
 * @returns Object with billing data and loading state
 */
export function useBillingByTeamId(teamId: string | null) {
  const {
    data: billingData,
    isLoading,
    refetch,
  } = useQuery<BillingInfo>({
    queryKey: ["billing", teamId],
    queryFn: async () => {
      if (!teamId) throw new Error("Team ID is required");
      const response = await fetch(`/api/billing/${teamId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch billing info");
      }
      return response.json();
    },
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    billing: billingData ?? null,
    isLoading,
    refreshBilling: refetch,
  };
}
