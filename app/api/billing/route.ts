import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

/**
 * GET /api/billing
 * Fetch billing info for the user's team
 * Requires admin role
 */
export async function GET(request: Request) {
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

    // Fetch user with team info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { team: { include: { billing: true } } },
    });

    if (!user || !user.team_id) {
      return NextResponse.json(
        { error: "User or team not found" },
        { status: 404 },
      );
    }

    // Only admins can access billing
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const team = user.team;
    const billing = team?.billing;

    return NextResponse.json({
      team_id: user.team_id,
      team_name: team?.name,
      billing_type: billing?.plan || "FREE",
      billing_status: billing?.status || "ACTIVE",
      billing_started: billing?.started_at,
      billing_ends: billing?.ends_at,
      is_billing: user.is_billing,
    });
  } catch (error) {
    console.error("Failed to fetch billing info:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing info" },
      { status: 500 },
    );
  }
}
