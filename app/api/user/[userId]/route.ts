import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

/**
 * GET /api/user/[userId]
 * Fetch user data by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

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
    const requestingUserId = payload.user_id as string;

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        team_id: true,
        team: {
          select: {
            id: true,
            name: true,
            owner_id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if requesting user has access to view this user
    // User can see themselves or team members
    const requestingUser = await prisma.user.findUnique({
      where: { id: requestingUserId },
      select: { team_id: true },
    });

    const hasAccess =
      requestingUserId === userId ||
      (user.team_id && user.team_id === requestingUser?.team_id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
