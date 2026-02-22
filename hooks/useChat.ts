"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeamMessages, sendMessage } from "@/server/actions/chat";
import { Message } from "@/schema/MessageSchema";
import { toast } from "sonner";
import { useCallback } from "react";

// ============================================================================
// CHAT HOOK
// ============================================================================

/**
 * useChat Hook
 * Manages chat messaging functionality for a team channel.
 * Handles message fetching, sending, and real-time updates.
 *
 * @param team_id - The ID of the team
 * @param channel_id - Optional channel ID for channel-specific messages
 * @returns Object with messages, loading states, and send function
 */
export function useChat(
  team_id: string,
  channel_id?: string | null,
  receiver_id?: string | null,
) {
  const queryClient = useQueryClient();

  // 🔹 Fetch Messages with cache
  const {
    data: messages = [],
    isLoading,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ["chat", team_id, channel_id, receiver_id],
    queryFn: async () => {
      const result = (await getTeamMessages(
        team_id,
        channel_id ?? undefined,
        receiver_id ?? undefined,
      )) as unknown as {
        success: boolean;
        messages?: Message[];
        error?: string;
      };
      if (result.success) {
        return result.messages || [];
      }
      throw new Error(result.error || "Uplink synchronization failed");
    },
    enabled: !!team_id && team_id !== "undefined",
    staleTime: 10000, // Cache data for 10 seconds to reduce refetching
  });

  // 🔹 Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      sendMessage(
        team_id,
        content,
        channel_id ?? undefined,
        receiver_id ?? undefined,
      ),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["chat", team_id, channel_id, receiver_id],
        });
      } else {
        toast.error(result.error || "Transmission failed");
      }
    },
  });

  /**
   * Send a new message
   * @param content - The message content to send
   * @returns Promise resolving when message is sent
   */
  const send = useCallback(
    async (content: string) => {
      return sendMutation.mutateAsync(content);
    },
    [sendMutation],
  );

  return {
    messages,
    loading: isLoading,
    isFetching,
    isSending: sendMutation.isPending,
    send,
    refreshMessages: refetch,
    error,
  };
}
