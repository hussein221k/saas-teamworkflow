/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginEmployee } from "@/server/actions/employee-auth";
import gsap from "gsap";
import { Loader2, Lock, Mail, User, ArrowRight, Sparkles } from "lucide-react";

export default function EmployeeLoginPage() {
  const [username, setUsername] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const decorativeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Container animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
      );

      // Decorative circles animation
      gsap.fromTo(
        decorativeRef.current?.children || [],
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.1,
          duration: 1.5,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)",
        },
      );

      // Card animation
      gsap.fromTo(
        cardRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.9,
          rotationX: 10,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "back.out(1.7)",
        },
      );

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: "power3.out" },
      );

      // Form elements stagger animation
      gsap.fromTo(
        inputsRef.current.filter(Boolean),
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.6,
          ease: "power3.out",
        },
      );

      // Button animation
      gsap.fromTo(
        buttonRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 1, ease: "power3.out" },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginEmployee({
        username,
        employeeCode,
        password,
      });

      if (result.success) {
        // Trigger success animation
        gsap.to(cardRef.current, {
          scale: 1.02,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
          onComplete: () => {
            toast.success("Welcome back!");
            router.refresh();
            router.push("/dashboard");
          },
        });
      } else {
        // Error animation
        gsap.to(cardRef.current, {
          x: 10,
          duration: 0.1,
          yoyo: true,
          repeat: 3,
          ease: "power2.inOut",
        });
        toast.error(result.error || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-purple-600 shadow-lg shadow-primary/25">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 ref={titleRef} className="text-3xl font-bold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your workspace
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
                htmlFor="username"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <div className="h-4 w-4 rounded-full bg-primary/20 animate-pulse" />
                </div>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your username"
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
                htmlFor="code"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                Employee Code
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <div className="h-4 w-4 rounded-full bg-blue-500/20 animate-pulse" />
                </div>
                <Input
                  id="code"
                  type="text"
                  required
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your employee code"
                />
              </div>
            </div>

            <div
              ref={(el) => {
                inputsRef.current[2] = el;
              }}
              className="space-y-2"
            >
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
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
              className="relative w-full overflow-hidden bg-linear-to-r from-primary to-purple-600 text-white transition-all duration-300 hover:from-primary/90 hover:to-purple-600/90 hover:shadow-lg hover:shadow-primary/25"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}

              {/* Animated shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
            </Button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Are you an admin? </span>
            <a
              href="/admin/login"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Admin Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
