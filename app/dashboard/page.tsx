import React from "react";
import Chatsmange from "@/components/dashboard/Chatchannels";

import Chat from "@/components/dashboard/Chat";
import Ai from "@/components/dashboard/Ai";
import TaskSidebar from "@/components/dashboard/Task";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { NotificationManager } from "@/components/dashboard/NotificationManager";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUserTeams } from "@/server/actions/team";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { checkSubscriptionStatus } from "@/server/actions/billing";
import ThemeCustomizer from "@/components/dashboard/ThemeCustomizer";
import ScrollSequence from "@/components/dashboard/ScrollSequence";

async function page() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  let dbUser = null;

  // 1. Try Kinde Auth
  if (kindeUser && kindeUser.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: kindeUser.email },
      include: { team: true },
    });
  }

  // 2. Try Employee Cookie Auth if not found
  if (!dbUser) {
    const cookieStore = await cookies();
    const token = cookieStore.get("employee_session")?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
        const { payload } = await jwtVerify(token, secret);
        if (payload.userId) {
          dbUser = await prisma.user.findUnique({
            where: { id: Number(payload.userId) }, // Ensure userId is a number
            include: { team: true },
          });
        }
      } catch (e) {
        // Invalid token
      }
    }
  }

  if (!dbUser) {
    if (kindeUser) return redirect("/onboarding");
    return redirect("/api/auth/login");
  }

  const teams = await getUserTeams(dbUser.id);

  // If the user has no team, redirect them to the onboarding page to create or join one.
  if (!dbUser.teamId) {
    return redirect("/onboarding");
  }

  // 3. Fetch latest team & billing info
  const currentTeam = await prisma.team.findUnique({
      where: { id: dbUser.teamId },
      include: { billing: true }
  });

  if (!currentTeam) return redirect("/onboarding");

  // Enforce subscription check
  await checkSubscriptionStatus(currentTeam.id);
  const currentPlan = currentTeam.billing?.plan || "FREE";

  return (
    <DashboardWrapper>
      <style>{`:root { --primary: ${(currentTeam as any).themeColor || "#6366f1"}; }`}</style>
      <NotificationManager />
      <div className="absolute inset-0 border-20 border-black/50 pointer-events-none" />
      <div className="absolute top-6 right-6 z-100 flex items-center gap-3">
         <ThemeCustomizer 
            teamId={currentTeam.id} 
            currentPlan={currentPlan} 
            initialColor={(currentTeam as any).themeColor || "#6366f1"} 
         />
      </div>
      <Chatsmange 
        userId={dbUser.id} 
        currentTeamId={dbUser.teamId} 
        initialTeams={teams as any} 
        isAdmin={dbUser.role === "ADMIN"}
      />
      <div className="flex flex-1 flex-col overflow-y-auto relative scrollbar-hide">
        <ScrollSequence frameCount={100} folderPath="/frames/" />
        
        <div className="flex flex-1 flex-row h-screen overflow-hidden relative border-t border-white/5 bg-zinc-950">
          <Chat teamId={dbUser.teamId!} currentUserId={dbUser.id} />
          <TaskSidebar 
            teamId={dbUser.teamId!} 
            userId={dbUser.id} 
            isAdmin={dbUser.role === "ADMIN"} 
          />
          <Ai user={{ name: dbUser.name, picture: kindeUser?.picture || "" }} />
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default page;
