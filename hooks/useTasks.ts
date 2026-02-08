"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeamTasks, createTask, updateTaskStatus } from "@/server/actions/task";
import { TaskStatus } from "@prisma/client";
import { toast } from "sonner";
import { useCallback } from "react";

export function useTasks(teamId: number) {
  const queryClient = useQueryClient();

  // 🔹 Fetch Tasks with cache
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ["tasks", teamId],
    queryFn: async () => {
      const result = await getTeamTasks(teamId);
      if (result.success) {
        const fetchedTasks = result.tasks || [];
        if (fetchedTasks.length === 0) {
          // Return Demo Data if empty
          return [
            { 
              id: -1, 
              title: "Welcome to your Command Center 🚀", 
              description: "This is a demo task showing how projects are organized.",
              status: TaskStatus.IN_PROGRESS,
              createdAt: new Date().toISOString(),
              assignedTo: { name: "Nebula AI" }
            },
            { 
              id: -2, 
              title: "Sync Team Workflow Protocols", 
              description: "Initialize team sync and verify encrypted channels.",
              status: TaskStatus.PENDING,
              createdAt: new Date().toISOString(),
              assignedTo: { name: "System" }
            }
          ];
        }
        return fetchedTasks;
      }
      throw new Error(result.error || "Failed to fetch tasks");
    },
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // 🔹 Add Task Mutation
  const addTaskMutation = useMutation({
    mutationFn: (data: { title: string; description?: string; status?: TaskStatus; assignedToId?: number; deadline?: string }) => 
      createTask(teamId, data as any),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Task synchronized across nodes.");
        queryClient.invalidateQueries({ queryKey: ["tasks", teamId] });
      } else {
        toast.error(result.error || "Uplink failure");
      }
    },
  });

  // 🔹 Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number, status: TaskStatus }) => 
      updateTaskStatus(taskId, status),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Optimistic update
        queryClient.setQueryData(["tasks", teamId], (old: any[] | undefined) => {
          return old?.map(t => t.id === variables.taskId ? { ...t, status: variables.status } : t) || [];
        });
      }
    },
  });

  const addTask = useCallback(async (data: any) => {
    return addTaskMutation.mutateAsync(data);
  }, [addTaskMutation]);

  const updateStatus = useCallback(async (taskId: number, status: TaskStatus) => {
    return updateStatusMutation.mutate({ taskId, status });
  }, [updateStatusMutation]);

  return {
    tasks,
    loading: isLoading,
    refreshTasks: refetch,
    addTask,
    updateStatus,
    isMutating: addTaskMutation.isPending || updateStatusMutation.isPending
  };
}
