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
 * @param teamId - The ID of the team
 * @param channelId - Optional channel ID for channel-specific messages
 * @returns Object with messages, loading states, and send function
 */
export function useChat(teamId: number, channelId?: number) {
  const queryClient = useQueryClient();

  // 🔹 Fetch Messages with cache
  const {
    data: messages = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["chat", teamId, channelId],
    queryFn: async () => {
      const result = (await getTeamMessages(teamId, channelId)) as unknown as {
        success: boolean;
        messages?: Message[];
        error?: string;
      };
      if (result.success) {
        return result.messages || [];
      }
      throw new Error(result.error || "Uplink synchronization failed");
    },
    enabled: !!teamId,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  // 🔹 Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: (content: string) => sendMessage(teamId, content, channelId),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["chat", teamId, channelId],
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
    isSending: sendMutation.isPending,
    send,
    refreshMessages: refetch,
  };
}
