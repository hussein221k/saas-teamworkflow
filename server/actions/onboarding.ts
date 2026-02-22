
"use server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/server/actions/admin-auth";
import { z } from "zod";
import { role } from "@prisma/client";
import { redirect } from "next/navigation";
import { secureAction } from "@/lib/security";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { UserSchema } from "@/schema/UserSchema";


const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

// ============================================================================
// RATE LIMITING (In-memory store for demo - use Redis in production)
// ============================================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(
  identifier: string,
  maxAttempts: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxAttempts - record.count };
}

// ============================================================================
// SERVER ACTIONS
// ============================================================================

export async function finishOnboarding(
  formData: z.infer<typeof UserSchema>,
) {
  // 1. Security Check (Arcjet + Rate Limiting)
  const security = await secureAction();
  if (security.denied) {
    return { success: false, error: security.error };
  }

  // 2. Rate Limiting (max 5 onboarding attempts per hour per email)
  const user = await getAdminSession();
  if (!user || !user.email) {
    return { success: false, error: "Unauthorized. Please login as admin." };
  }

  const userEmail = user.email.toLowerCase().trim();

  const rateLimit = checkRateLimit(
    `onboarding:${userEmail}`,
    5,
    60 * 60 * 1000,
  );
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "Too many onboarding attempts. Please try again later.",
    };
  }

  // 3. Input Validation (Zod)
  const parse = prisma.user.create({data:formData})
  if (!parse) {
    return { success: false, error: "someThing Wrong"};
  }


  // 4. Check for existing user with team
  const existing = await prisma.user.findUnique({
    where: { email: user.email },
    select: {
      id: true,
      name: true,
      email: true,
      team_id: true,
    },
  });

  if (existing && existing.team_id) {
    return { success: false, error: "Account already set up" };
  }

  try {


    // 6. Clear cache and redirect
    revalidatePath("/");
    redirect("/admin");
  } catch (e) {
    console.error("Onboarding failed:", e);
    return { success: false, error: "Setup failed. Please try again." };
  }
}

// ============================================================================
// ADMIN SIGNUP - Create new admin with their own team
// ============================================================================

export async function adminSignup(formData: z.infer<typeof UserSchema> , teamName : string) {
  // 1. Security Check (Arcjet)
  const security = await secureAction();
  if (security.denied) {
    return { success: false, error: security.error };
  }

  // 2. Input Validation (Zod)
  const parse = prisma.user.create({data:formData})
  if (!parse) {
    return { success: false, error: "something wrong" };
  }

  const {email  , password , is_billing , billing_type , name }  = formData

  // 3. Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: "Email already registered" };
  }

  try {
    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 5. Create admin user and team in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Sanitize inputs
      const sanitizedName = name
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 50);
      const sanitizedTeamName = teamName
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 100);
      const sanitizedEmail = email.toLowerCase().trim();

      // Create admin user
      const adminUser = await tx.user.create({
        data: {
          name: sanitizedName,
          email: sanitizedEmail,
          username: sanitizedEmail.split("@")[0],
          password: hashedPassword,
          role: role.ADMIN,
          is_billing: is_billing,
          billing_type: billing_type,
        },
        select: { id: true, name: true, email: true },
      });

      // Create team owned by this admin
      const newTeam = await tx.team.create({
        data: {
          name: sanitizedTeamName,
          owner_id: adminUser.id,
        },
        select: { id: true, name: true },
      });

      // Update user with team ID
      await tx.user.update({
        where: { id: adminUser.id },
        data: { team_id: newTeam.id },
      });

      // Create billing record if not free plan
      if (billing_type !== "FREE") {
        await tx.billing.create({
          data: {
            team_id: newTeam.id,
            plan: billing_type,
            status: "ACTIVE",
            started_at: new Date(),
          },
        });
      }

      return { user: adminUser, team: newTeam };
    });

    // 6. Generate admin session token
    const token = await new SignJWT({
      user_id: result.user.id,
      role: "ADMIN",
      ip: "unknown",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(SECRET_KEY);

    // 7. Set admin session cookie
    (await cookies()).set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    // 8. Clear cache and redirect
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Admin signup failed:", e);
    return { success: false, error: "Signup failed. Please try again." };
  }
}
