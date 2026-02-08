"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeamMessages, sendMessage } from "@/server/actions/chat";
import { toast } from "sonner";
import { useCallback } from "react";

export function useChat(teamId: number, channelId?: number) {
  const queryClient = useQueryClient();

  // 🔹 Fetch Messages with cache
  const { data: messages = [], isLoading, refetch } = useQuery({
    queryKey: ["chat", teamId, channelId],
    queryFn: async () => {
      const result = await getTeamMessages(teamId, channelId) as any;
      if (result.success) {
        return result.messages || [];
      }
      throw new Error(result.error || "Uplink synchronization failed");
    },
    enabled: !!teamId,
    refetchInterval: 5000,
  });

  // 🔹 Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: (content: string) => sendMessage(teamId, content, channelId),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["chat", teamId, channelId] });
      } else {
        toast.error(result.error || "Transmission failed");
      }
    },
  });

  const send = useCallback(async (content: string) => {
    return sendMutation.mutateAsync(content);
  }, [sendMutation]);

  return {
    messages,
    loading: isLoading,
    isSending: sendMutation.isPending,
    send,
    refreshMessages: refetch,
  };
}
