import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

/**
 * GET /api/team
 * Fetch all teams for the current user (owned + member teams)
 */
export async function GET() {
  try {
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies(),
    );

    // Check for admin session first, then employee session
    let session = cookieStore.get("admin_session");

    if (!session?.value) {
      session = cookieStore.get("employee_session");
    }

    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(session.value, SECRET_KEY);
    const userId = payload.user_id as string;

    // Fetch owned teams
    const ownedTeams = await prisma.team.findMany({
      where: { owner_id: userId },
      include: { billing: true },
    });

    // Fetch teams user is a member of
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        team: {
          include: { billing: true },
        },
      },
    });

    // Combine teams, avoiding duplicates
    const teams = [...ownedTeams];
    const userTeam = user?.team;
    if (userTeam) {
      const isAlreadyInList = teams.some((t) => t.id === userTeam.id);
      if (!isAlreadyInList) {
        teams.push(userTeam);
      }
    }

    // Check if user is admin
    const isAdmin = user?.role === "ADMIN";

    return NextResponse.json({
      teams,
      isAdmin,
    });
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}
