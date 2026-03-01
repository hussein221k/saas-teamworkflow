import { Session } from "@/schema/UserSchema";
import { getSession } from "@/lib/auth";

// central authentication helpers that server actions can re-use

/**
 * Throws if there is no valid user session.
 * Returns the session object otherwise.
 */
export async function requireAuth(): Promise<Session> {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Ensures the current session belongs to an employee.
 * Use in places where only employees should be allowed.
 */
export async function requireEmployee(): Promise<Session> {
  const user = await requireAuth();
  if (user.role !== "EMPLOYEE") {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Ensures the current session belongs to an admin user.
 * Use for admin-only server actions.
 */
export async function requireAdmin(): Promise<Session> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("Unauthorized. Please login as admin.");
  }
  return user;
}
