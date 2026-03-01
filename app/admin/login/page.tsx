/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginAdmin, getAdminSession } from "@/server/actions/admin-auth";
import { Loader2, Lock, Mail, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // Start with true to show loading
  const router = useRouter();

  // Check for existing admin session on mount
  useEffect(() => {
    const checkSession = async () => {
      const session = await getAdminSession();
      if (session && session.role === "ADMIN") {
        // Already logged in as admin, redirect to admin dashboard
        const teamId = session.team_id || "";
        router.push(teamId ? `/admin/dashboard/${teamId}` : "/onboarding");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const decorativeRef = useRef<HTMLDivElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAdmin({
        email,
        password,
      });

      if (result.success) {
        toast.success("Welcome back, Admin!");
        router.refresh();
        const targetUrl = result.redirectUrl || "/admin/dashboard";
        router.push(targetUrl);
      } else {
        toast.error(result.error || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking session
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/30"
    >
      {/* Decorative elements */}
      <div
        ref={decorativeRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <Card
        ref={cardRef}
        className="relative w-full max-w-md overflow-hidden border-none bg-background/80 shadow-2xl backdrop-blur-xl"
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary via-purple-500 to-blue-500 opacity-20" />
        <div className="absolute inset-px rounded-xl bg-background" />

        <CardHeader className="relative space-y-6 pb-8 pt-10 text-center">
          <div className="relative mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 ref={titleRef} className="text-3xl font-bold tracking-tight">
              Admin Portal
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access the admin dashboard
            </p>
          </div>
        </CardHeader>

        <CardContent className="relative px-8 pb-8">
          <form ref={formRef} onSubmit={handleLogin} className="space-y-5">
            <div
              ref={(el) => {
                inputsRef.current[0] = el;
              }}
              className="space-y-2"
            >
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                Admin Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <div className="h-4 w-4 rounded-full bg-primary/20 animate-pulse" />
                </div>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div
              ref={(el) => {
                inputsRef.current[1] = el;
              }}
              className="space-y-2"
            >
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <div className="h-4 w-4 rounded-full bg-purple-500/20 animate-pulse" />
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <Button
              ref={buttonRef}
              type="submit"
              className="relative w-full overflow-hidden bg-linear-to-r from-amber-500 to-orange-600 text-white transition-all duration-300 hover:from-amber-500/90 hover:to-orange-600/90 hover:shadow-lg hover:shadow-amber-500/25"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span>Admin Login</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}

              {/* Animated shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
            </Button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Are you an employee? </span>
            <Link
              href="/employee/login"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
