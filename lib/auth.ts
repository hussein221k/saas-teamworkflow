/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

// ============================================================================
// TYPES
// ============================================================================

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  teamId: number | null;
};

// ============================================================================
// FUNCTIONS
// ============================================================================

export async function getSession(): Promise<SessionUser | null> {
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
      where: { id: payload.userId as number },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
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
      teamId: user.teamId,
    };
  } catch (error) {
    // Invalid token or other error
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
