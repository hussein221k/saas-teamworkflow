/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";
import { secureAction } from "@/lib/security";

// ============================================================================
// SCHEMA VALIDATION
// ============================================================================

const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(100),
});

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

// ============================================================================
// RATE LIMITING (In-memory store for demo - use Redis in production)
// ============================================================================

const loginRateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

function checkLoginRateLimit(
  identifier: string,
  maxAttempts: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = loginRateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    loginRateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
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

export async function loginAdmin(data: z.infer<typeof AdminLoginSchema>) {
  // 1. Security Check (Arcjet)
  const security = await secureAction();
  if (security.denied) {
    return { success: false, error: security.error };
  }

  // 2. Input Validation (Zod)
  const parse = AdminLoginSchema.safeParse(data);
  if (!parse.success) {
    return { success: false, error: "Invalid input" };
  }

  const { email, password } = parse.data;

  // 3. Rate Limiting (max 5 login attempts per 15 min per IP/email)
  const clientIp = "unknown"; // In production, get from headers
  const rateLimitKey = `${clientIp}:${email}`;
  const rateLimit = checkLoginRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "Too many login attempts. Please try again later.",
    };
  }

  // 4. Sanitize inputs
  const sanitizedEmail = email.replace(/<[^>]*>/g, "").trim();

  // 5. Find admin user
  const user = await prisma.user.findUnique({
    where: {
      email: sanitizedEmail,
    },
  });

  // 6. Check if user exists and is admin
  if (!user || user.role !== "ADMIN") {
    // Add artificial delay to prevent timing attacks
    await bcrypt.compare(
      password,
      "$2b$10$dummyhashedpasswordfornonexistentuser",
    );
    return { success: false, error: "Invalid credentials" };
  }

  // 7. Verify password (bcrypt handles timing attacks)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, error: "Invalid credentials" };
  }

  // 8. Generate Session Token
  const token = await new SignJWT({
    userId: user.id,
    role: user.role,
    ip: clientIp,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET_KEY);

  // 9. Set secure cookie
  (await cookies()).set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return { success: true };
}

export async function logoutAdmin() {
  (await cookies()).delete("admin_session");
  return { success: true };
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

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

    return user;
  } catch (error) {
    // Invalid token
    return null;
  }
}
