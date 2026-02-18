import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

/**
 * GET /api/team
 * Fetch teams for the authenticated user
 * Handles both admin and employee sessions
 */
export async function GET(request: Request) {
  try {
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies(),
    );

    // Check for admin session first, then employee session
    let session = cookieStore.get("admin_session");
    let isAdmin = true;

    if (!session?.value) {
      session = cookieStore.get("employee_session");
      isAdmin = false;
    }

    if (!session?.value) {
      return NextResponse.json({ teams: [], isAdmin: false });
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(session.value, SECRET_KEY);

    // Fetch user's teams
    const userId = payload.user_id as string;

    // Get teams owned by user
    const ownedTeams = await prisma.team.findMany({
      where: { owner_id: userId },
    });

    // Get user's current team (even if not owned)
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
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

    return NextResponse.json({ teams, isAdmin });
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return NextResponse.json(
      { teams: [], error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}
