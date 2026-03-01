"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChannelMembers,
  addChannelMember,
  removeChannelMember,
} from "@/server/actions/channel";
import { getTeamMembers } from "@/server/actions/team";
import { toast } from "sonner";
import { useCallback } from "react";

/**
 * Hook for managing channel membership UI interactions.
 *
 * @param channel_id - id of the channel to manage
 * @param team_id - team id (used to fetch potential members)
 */
export function useChannelMembers(channel_id: string | null, team_id: string) {
  const queryClient = useQueryClient();

  const {
    data: members = [],
    isLoading: loadingMembers,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ["channelMembers", channel_id],
    queryFn: () => (channel_id ? getChannelMembers(channel_id) : []),
    enabled: !!channel_id,
  });

  const { data: teamMembers = [], isLoading: loadingTeamMembers } = useQuery({
    queryKey: ["teamMembers", team_id],
    queryFn: () => getTeamMembers(team_id),
    enabled: !!team_id,
  });

  const addMutation = useMutation({
    mutationFn: ({ user_id }: { user_id: string }) =>
      addChannelMember(channel_id!, user_id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Member added");
        queryClient.invalidateQueries({
          queryKey: ["channelMembers", channel_id],
        });
      } else {
        toast.error(res.error || "Add failed");
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ user_id }: { user_id: string }) =>
      removeChannelMember(channel_id!, user_id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Member removed");
        queryClient.invalidateQueries({
          queryKey: ["channelMembers", channel_id],
        });
      } else {
        toast.error(res.error || "Remove failed");
      }
    },
  });

  const addUser = useCallback(
    async (user_id: string) => {
      if (!channel_id) return;
      return addMutation.mutateAsync({ user_id });
    },
    [channel_id, addMutation],
  );

  const removeUser = useCallback(
    async (user_id: string) => {
      if (!channel_id) return;
      return removeMutation.mutateAsync({ user_id });
    },
    [channel_id, removeMutation],
  );

  return {
    members,
    loadingMembers,
    teamMembers,
    loadingTeamMembers,
    addUser,
    removeUser,
    addLoading: addMutation.isPending,
    removeLoading: removeMutation.isPending,
    refetchMembers,
  };
}
