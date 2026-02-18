import { PageTransition } from "@/components/PageTransition";
import React from "react";
import Chatsmange from "@/components/dashboard/Chatchannels";
import TaskSidebar from "@/components/dashboard/Task";
import Chat from "@/components/dashboard/Chat";
import Ai from "@/components/dashboard/Ai";
import { getAdminSession } from "@/server/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUserTeams } from "@/server/actions/team";

async function page({ params }: { params: Promise<{ team_id: string }> }) {
  // Get admin session
  const user = await getAdminSession();

  if (!user || user.role !== "ADMIN") {
    return redirect("/admin/login");
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { team: true },
  });

  if (!dbUser) {
    return redirect("/onboarding");
  }

  // Get all teams for the user to populate the sidebar
  const rawTeams = await getUserTeams(dbUser.id);

  // Explicit ID validation: Compare user's team ID with URL param
  const { team_id: urlTeamId } = await params;

  if (urlTeamId) {
    // Check if the team_id in URL matches user's team or user has access
    const isUserTeam = dbUser.team_id === urlTeamId;
    const hasAccessToTeam = rawTeams.some((t) => t.id === urlTeamId);

    // Only allow access if it's user's own team OR user is ADMIN
    if (!isUserTeam && !hasAccessToTeam && dbUser.role !== "ADMIN") {
      // User is trying to access a team they don't belong to
      return redirect(`/admin/dashboard/${dbUser.team_id}`);
    }
  }

  // Map to match component expectation (invite_code -> inviteCode)
  const teams = rawTeams.map((t) => ({
    ...t,
    inviteCode: t.invite_code,
  }));

  // Determine which team to show based on URL param
  let activeteam_id = dbUser.team_id;
  const { team_id: team_id } = await params;

  if (team_id) {
    const requestedTeam = await prisma.team.findUnique({
      where: { id: team_id },
    });

    if (requestedTeam) {
      // additional check: does user have access?
      const canAccess = rawTeams.some((t) => t.id === requestedTeam.id);
      if (canAccess || dbUser.role === "ADMIN") {
        activeteam_id = requestedTeam.id;
      }
    }
  }

  if (!activeteam_id) {
    return redirect("/onboarding");
  }

  return (
    <PageTransition>
      <div className="flex bg-background h-screen w-full overflow-hidden">
        <Chatsmange
          user_id={dbUser.id}
          currentteam_id={activeteam_id}
          initialTeams={teams}
          isAdmin={dbUser.role === "ADMIN"}
        />
        <div className="flex flex-1 flex-row relative">
          <Chat team_id={activeteam_id} currentuser_id={dbUser.id} />
          <TaskSidebar
            team_id={activeteam_id}
            user_id={dbUser.id}
            isAdmin={dbUser.role === "ADMIN"}
          />
          <Ai />
        </div>
      </div>
    </PageTransition>
  );
}

export default page;
