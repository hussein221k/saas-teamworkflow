import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

/**
 * GET /api/team/[teamId]
 * Fetch a specific team by ID with billing info
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    const { teamId } = await params;

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

    // Fetch the team
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        billing: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user has access to this team
    const isOwner = team.owner_id === userId;
    const isMember = team.users.some((u: { id: string }) => u.id === userId);

    if (!isOwner && !isMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Failed to fetch team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}
