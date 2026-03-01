/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkSubscriptionStatus } from "@/server/actions/billing";
import DashboardContent from "./_components/DashboardContent";

async function page({ params }: { params: Promise<{ teamId: string }> }) {
  // Get current user session
  const user = await getSession();

  if (!user) {
    return redirect("/employee/login");
  }

  // If user has no team, redirect to onboarding
  if (!user.team_id) {
    return redirect("/onboarding");
  }

  // Get teamId from URL params
  const { teamId: urlTeamId } = await params;

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
    <DashboardContent
      teamId={currentTeam.id}
      userId={user.id}
      userRole={user.role as "ADMIN" | "EMPLOYEE"}
      initialTeams={formattedTeams}
    />
  );
}

export default page;
