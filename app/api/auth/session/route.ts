
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key",
);

export async function GET() {
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
      return NextResponse.json({ user: null });
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(session.value, SECRET_KEY);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.user_id as string },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user, isAdmin });
  } catch (error) {
    return NextResponse.json({ user: null , error: error });
  }
}
