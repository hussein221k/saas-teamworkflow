"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTeamTasks,
  createTask,
  updateTaskStatus,
} from "@/server/actions/task";
import { toast } from "sonner";
import { useCallback } from "react";
import { Task } from "@/schema/TaskSchema";

// Local enum definition to avoid importing @prisma/client in client components
const task_status = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  OVERDUE: "OVERDUE",
} as const;

export type TaskStatus = (typeof task_status)[keyof typeof task_status];

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Task data interface matching Prisma schema
 */

/**
 * Input data for creating a new task
 */

/**
 * Parameter type for createTask server action
 */

// ============================================================================
// HOOK DEFINITION
// ============================================================================

/**
 * useTasks Hook
 * Manages task fetching, creation, and status updates for a team.
 * Provides optimistic updates for better user experience.
 *
 * @param team_id - The ID of the team to fetch tasks for
 */
export function useTasks(team_id: string) {
  const queryClient = useQueryClient();

  // 🔹 Fetch Tasks with cache
  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks", team_id],
    queryFn: async () => {
      const result = await getTeamTasks(team_id);
      if (result.success) {
        const fetchedTasks = result.tasks || [];
        if (fetchedTasks.length === 0) {
          // Return Demo Data if empty
          return [
            {
              id: -1,
              title: "Welcome to your Command Center 🚀",
              description:
                "This is a demo task showing how projects are organized.",
              status: task_status.IN_PROGRESS,
              created_at: new Date().toISOString(),
              assigned_to: { name: "Nebula AI", id: -1 },
              assigned_to_id: -1,
              team_id: team_id,
              deadline: undefined,
            },
            {
              id: -2,
              title: "Sync Team Workflow Protocols",
              description:
                "Initialize team sync and verify encrypted channels.",
              status: task_status.PENDING,
              created_at: new Date().toISOString(),
              assigned_to: { name: "System", id: -2 },
              assigned_to_id: -2,
              team_id: team_id,
              deadline: undefined,
            },
          ];
        }
        return fetchedTasks;
      }
      throw new Error(result.error || "Failed to fetch tasks");
    },
    enabled: !!team_id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // 🔹 Add Task Mutation
  const addTaskMutation = useMutation({
    mutationFn: (data: Task) => createTask(data as Task),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Task synchronized across nodes.");
        queryClient.invalidateQueries({ queryKey: ["tasks", team_id] });
      } else {
        toast.error(result.error || "Uplink failure");
      }
    },
  });

  // 🔹 Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTaskStatus(taskId, status),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Optimistic update
        queryClient.setQueryData(
          ["tasks", team_id],
          (old: Task[] | undefined) => {
            return (
              old?.map((t) =>
                t.id === variables.taskId
                  ? { ...t, status: variables.status }
                  : t,
              ) || []
            );
          },
        );
      }
    },
  });

  /**
   * Add a new task
   * @param data - Task input data
   */
  const addTask = useCallback(
    async (data: Task) => {
      return addTaskMutation.mutateAsync(data);
    },
    [addTaskMutation],
  );

  /**
   * Update task status
   * @param taskId - ID of the task to update
   * @param status - New status for the task
   */
  const updateStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      return updateStatusMutation.mutate({ taskId, status });
    },
    [updateStatusMutation],
  );

  return {
    tasks,
    loading: isLoading,
    refreshTasks: refetch,
    addTask,
    updateStatus,
    isMutating: addTaskMutation.isPending || updateStatusMutation.isPending,
  };
}
