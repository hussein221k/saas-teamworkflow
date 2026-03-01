"use client";

import React, { Suspense } from "react";
import TaskSidebar from "@/components/dashboard/Task";
import DashboardLoading from "./DashboardLoading";

interface TaskSectionProps {
  teamId: string;
  userId: string;
  isAdmin: boolean;
}

export default function TaskSection({
  teamId,
  userId,
  isAdmin,
}: TaskSectionProps) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <TaskSidebar team_id={teamId} user_id={userId} isAdmin={isAdmin} />
    </Suspense>
  );
}
