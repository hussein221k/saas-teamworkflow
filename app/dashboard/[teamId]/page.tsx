import React from "react";
import Chatsmange from "@/components/dashboard/Chatchannels";
import Chat from "@/components/dashboard/Chat";
import Ai from "@/components/dashboard/Ai";
import TaskSidebar from "@/components/dashboard/Task";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { NotificationManager } from "@/components/dashboard/NotificationManager";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkSubscriptionStatus } from "@/server/actions/billing";
import ThemeCustomizer from "@/components/dashboard/ThemeCustomizer";
import ScrollSequence from "@/components/dashboard/ScrollSequence";

async function page({ params }: { params: Promise<{ team_id: string }> }) {
  // Get current user session
  const user = await getSession();

  if (!user) {
    return redirect("/employee/login");
  }

  // If user has no team, redirect to onboarding
  if (!user.team_id) {
    return redirect("/onboarding");
  }

  // Get team_id from URL params
  const { team_id: urlTeamId } = await params;

  // Explicit ID validation: Compare user's team ID with URL param
  if (urlTeamId && urlTeamId !== user.team_id) {
    // User is trying to access a different team's dashboard
    // Verify this is allowed
    const requestedTeam = await prisma.team.findUnique({
      where: { id: urlTeamId },
    });

    // Only allow if the requested team matches user's team
    if (!requestedTeam || requestedTeam.id !== user.team_id) {
      // Redirect to user's own team dashboard
      return redirect(`/dashboard/${user.team_id}`);
    }
  }

  // Use user's team_id
  const team_id = user.team_id;

  // Fetch team data with billing
  const currentTeam = await prisma.team.findUnique({
    where: { id: team_id },
    include: { billing: true },
  });

  if (!currentTeam) {
    return redirect("/onboarding");
  }

  // Check subscription status
  await checkSubscriptionStatus(currentTeam.id);
  const currentPlan = currentTeam.billing?.plan || "FREE";

  // Get user's teams for sidebar
  const userTeamsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/team`,
    {
      headers: {
        cookie: "",
      },
    },
  ).catch(() => ({ json: async () => ({ teams: [], isAdmin: false }) }));

  // Fallback: fetch teams directly
  const ownedTeams = await prisma.team.findMany({
    where: { owner_id: user.id },
  });

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { team: true },
  });

  const teams = [...ownedTeams];
  if (currentUser?.team) {
    const team = currentUser.team;
    const isAlreadyInList = teams.some((t) => t.id === team.id);
    if (!isAlreadyInList) {
      teams.push(team);
    }
  }

  const formattedTeams = teams.map((t) => ({
    ...t,
    inviteCode: t.invite_code,
  }));

  return (
    <DashboardWrapper>
      <style>{`:root { --primary: ${currentTeam.theme_color || "#6366f1"}; }`}</style>
      <NotificationManager />
      <div className="absolute inset-0 border-20 border-black/50 pointer-events-none" />
      <div className="absolute top-6 right-6 z-100 flex items-center gap-3">
        <ThemeCustomizer
          team_id={currentTeam.id}
          currentPlan={currentPlan}
          initialColor={currentTeam.theme_color || "#6366f1"}
        />
      </div>
      <Chatsmange
        user_id={user.id}
        currentteam_id={user.team_id}
        initialTeams={formattedTeams}
        isAdmin={user.role === "ADMIN"}
      />
      <div className="flex flex-1 flex-col overflow-y-auto relative scrollbar-hide">
        <ScrollSequence frameCount={5} folderPath="/frames/" />

        <div className="flex flex-1 flex-row h-screen overflow-hidden relative border-t border-white/5 bg-zinc-950">
          <Chat team_id={user.team_id} currentuser_id={user.id} />
          <TaskSidebar
            team_id={user.team_id}
            user_id={user.id}
            isAdmin={user.role === "ADMIN"}
          />
          <Ai />
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default page;
