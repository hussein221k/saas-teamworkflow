"use client";

import React, { Suspense } from "react";
import Chatsmange from "@/components/dashboard/Chatchannels";
import DashboardLoading from "./DashboardLoading";

interface ChannelSectionProps {
  userId: string;
  teamId: string;
  initialTeams: Array<{
    id: string;
    name: string;
    owner_id: string;
    inviteCode: string | null;
    [key: string]: unknown;
  }>;
  isAdmin: boolean;
}

export default function ChannelSection({
  userId,
  teamId,
  initialTeams,
  isAdmin,
}: ChannelSectionProps) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <Chatsmange
        user_id={userId}
        currentteam_id={teamId}
        initialTeams={initialTeams}
        isAdmin={isAdmin}
      />
    </Suspense>
  );
}
