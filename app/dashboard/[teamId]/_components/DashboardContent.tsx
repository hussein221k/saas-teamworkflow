"use client";

import React, { Suspense } from "react";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { NotificationManager } from "@/components/dashboard/NotificationManager";
import ThemeCustomizer from "@/components/dashboard/ThemeCustomizer";
import ScrollSequence from "@/components/dashboard/ScrollSequence";
import { useTeam } from "@/hooks/useTeam";
import DashboardLoading from "./DashboardLoading";
import ChatSection from "./ChatSection";
import TaskSection from "./TaskSection";
import ChannelSection from "./ChannelSection";
// FEATURE: AI Section — Planned upgrade. Restore: import AiSection from "./AiSection";

interface DashboardContentProps {
  teamId: string;
  userId: string;
  userRole: "ADMIN" | "EMPLOYEE";
  initialTeams: Array<{
    id: string;
    name: string;
    owner_id: string;
    inviteCode: string | null;
    [key: string]: unknown;
  }>;
}

export default function DashboardContent({
  teamId,
  userId,
  userRole,
  initialTeams,
}: DashboardContentProps) {
  const { team, isLoading } = useTeam(teamId);
  const currentTeam = team;
  // Plan used when ThemeCustomizer / billing is re-enabled
  const currentPlan = team?.billing?.plan ?? "FREE";
  const themeColor = team?.theme_color || "#6366f1";

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!currentTeam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <p className="text-zinc-400">Team not found</p>
      </div>
    );
  }

  return (
    <DashboardWrapper>
      <style>{`:root { --primary: ${themeColor}; }`}</style>
      <Suspense fallback={null}>
        <NotificationManager />
      </Suspense>

      <div className="absolute inset-0 border-20 border-black/50 pointer-events-none" />

      <div className="absolute top-6 right-6 z-100 flex items-center gap-3">
        <Suspense
          fallback={
            <div className="w-10 h-10 bg-zinc-800 rounded-xl animate-pulse" />
          }
        >
          <ThemeCustomizer
            team_id={currentTeam.id}
            currentPlan={currentPlan}
            initialColor={themeColor}
          />
        </Suspense>
      </div>

      <ChannelSection
        userId={userId}
        teamId={teamId}
        initialTeams={initialTeams}
        isAdmin={userRole === "ADMIN"}
      />

      <div className="flex flex-1 flex-col overflow-y-auto relative scrollbar-hide">
        <Suspense fallback={<DashboardLoading />}>
          <ScrollSequence frameCount={5} folderPath="/frames/" />
        </Suspense>

        <div className="flex flex-1 flex-row h-screen overflow-hidden relative border-t border-white/5 bg-zinc-950">
          <ChatSection teamId={teamId} currentUserId={userId} />
          <TaskSection
            teamId={teamId}
            userId={userId}
            isAdmin={userRole === "ADMIN"}
          />
          {/* FEATURE: AI Section — Planned upgrade. Restore: <AiSection /> */}
        </div>
      </div>
    </DashboardWrapper>
  );
}
