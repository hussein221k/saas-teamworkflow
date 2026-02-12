import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require authentication
const publicPaths = [
  "/",
  "/billing",
  "/about",
  "/contact",
  "/employee/login",
  "/api/auth",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath),
  );

  // Check for session cookie
  const session = request.cookies.get("employee_session");

  // If path is not public and no session, redirect to login
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL("/employee/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
