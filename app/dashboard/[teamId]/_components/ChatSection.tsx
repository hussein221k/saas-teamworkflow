"use client";

import React, { Suspense } from "react";
import Chat from "@/components/dashboard/Chat";
import DashboardLoading from "./DashboardLoading";

interface ChatSectionProps {
  teamId: string;
  currentUserId: string;
}

export default function ChatSection({
  teamId,
  currentUserId,
}: ChatSectionProps) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <Chat team_id={teamId} currentuser_id={currentUserId} />
    </Suspense>
  );
}
