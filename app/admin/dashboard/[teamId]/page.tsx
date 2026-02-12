import { PageTransition } from "@/components/PageTransition";
import React from "react";
import Chatsmange from "@/components/dashboard/Chatchannels";
import TaskSidebar from "@/components/dashboard/Task";
import Chat from "@/components/dashboard/Chat";
import Ai from "@/components/dashboard/Ai";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUserTeams } from "@/server/actions/team";

async function page() {
  const user = await getSession();

  if (!user || !user.email) {
    return redirect("/employee/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { team: true },
  });

  if (!dbUser) {
    return redirect("/onboarding");
  }

  if (!dbUser.teamId) {
    return redirect("/onboarding");
  }

  const teams = await getUserTeams(dbUser.id);

  return (
    <PageTransition>
      <div className="flex bg-background h-screen w-full overflow-hidden">
        <Chatsmange
          userId={dbUser.id}
          currentTeamId={dbUser.teamId}
          initialTeams={teams}
          isAdmin={dbUser.role === "ADMIN"}
        />
        <div className="flex flex-1 flex-row relative">
          <Chat teamId={dbUser.teamId} currentUserId={dbUser.id} />
          <TaskSidebar
            teamId={dbUser.teamId}
            userId={dbUser.id}
            isAdmin={dbUser.role === "ADMIN"}
          />
          <Ai />
        </div>
      </div>
    </PageTransition>
  );
}

export default page;
