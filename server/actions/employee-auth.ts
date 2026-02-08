"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

const LoginSchema = z.object({
  username: z.string(),
  employeeCode: z.string(),
  password: z.string(),
});

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");

export async function loginEmployee(data: z.infer<typeof LoginSchema>) {
  const parse = LoginSchema.safeParse(data);
  if (!parse.success) {
      return { success: false, error: "Invalid input" };
  }

  const { username, employeeCode, password } = parse.data;

  const user = await prisma.user.findFirst({
      where: {
          username,
          employeeCode,
      }
  });

  if (!user) {
      return { success: false, error: "Invalid credentials" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
      return { success: false, error: "Invalid credentials" };
  }

  // Generate Session
  const token = await new SignJWT({ userId: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(SECRET_KEY);

  (await cookies()).set("employee_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
  });

  return { success: true };
}

export async function logoutEmployee() {
    (await cookies()).delete("employee_session");
    return { success: true };
}
