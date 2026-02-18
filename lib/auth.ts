/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { Session } from "@/schema/UserSchema";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

// ============================================================================
// FUNCTIONS
// ============================================================================

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("employee_session");

    if (!session?.value) {
      return null;
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(session.value, SECRET_KEY);

    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.user_id as string },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        team_id: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email || "",
      role: user.role,
      team_id: user.team_id || "",
    };
  } catch (error) {
    // Invalid token or other error
    return null;
  }
}

export async function requireAuth(): Promise<Session> {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
