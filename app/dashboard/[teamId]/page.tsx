
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
import { getUserTeams } from "@/server/actions/team";
import { checkSubscriptionStatus } from "@/server/actions/billing";
import ThemeCustomizer from "@/components/dashboard/ThemeCustomizer";
import ScrollSequence from "@/components/dashboard/ScrollSequence";

async function page() {
  const user = await getSession();

  let dbUser = null;

  // Use the new session auth
  if (user && user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { team: true },
    });
  }

  if (!dbUser) {
    return redirect("/employee/login");
  }

  const teams = await getUserTeams(dbUser.id);

  // If the user has no team, redirect them to the onboarding page to create or join one.
  if (!dbUser.teamId) {
    return redirect("/onboarding");
  }

  // 3. Fetch latest team & billing info
  const currentTeam = await prisma.team.findUnique({
    where: { id: dbUser.teamId },
    include: { billing: true },
  });

  if (!currentTeam) return redirect("/onboarding");

  // Enforce subscription check
  await checkSubscriptionStatus(currentTeam.id);
  const currentPlan = currentTeam.billing?.plan || "FREE";

  return (
    <DashboardWrapper>
      <style>{`:root { --primary: ${currentTeam.themeColor || "#6366f1"}; }`}</style>
      <NotificationManager />
      <div className="absolute inset-0 border-20 border-black/50 pointer-events-none" />
      <div className="absolute top-6 right-6 z-100 flex items-center gap-3">
        <ThemeCustomizer
          teamId={currentTeam.id}
          currentPlan={currentPlan}
          initialColor={currentTeam.themeColor || "#6366f1"}
        />
      </div>
      <Chatsmange
        userId={dbUser.id}
        currentTeamId={dbUser.teamId}
        initialTeams={teams}
        isAdmin={dbUser.role === "ADMIN"}
      />
      <div className="flex flex-1 flex-col overflow-y-auto relative scrollbar-hide">
        <ScrollSequence frameCount={5} folderPath="/frames/" />

        <div className="flex flex-1 flex-row h-screen overflow-hidden relative border-t border-white/5 bg-zinc-950">
          <Chat teamId={dbUser.teamId!} currentUserId={dbUser.id} />
          <TaskSidebar
            teamId={dbUser.teamId!}
            userId={dbUser.id}
            isAdmin={dbUser.role === "ADMIN"}
          />
          <Ai />
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default page;
