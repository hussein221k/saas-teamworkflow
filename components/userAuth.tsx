"use client";

import { Button } from "./ui/button";
import { ModeToggle } from "./ui/ModeToggle";
import { useAuth } from "@/app/AuthProvider";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";

type Props = { isScrolled: boolean };

export default function UserAuthClient({ isScrolled }: Props) {
  const { user, isLoading, isAdmin, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (user && profileRef.current) {
      gsap.fromTo(
        profileRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      );
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push(isAdmin ? "/admin/login" : "/employee/login");
  };

  if (isLoading) {
    return null; // Or a small spinner
  }

  return (
    <>
      <ModeToggle />

      {user ? (
        <div ref={profileRef} className="ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                  <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.role === "ADMIN" ? (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(isScrolled && "lg:hidden")}
          >
            <Link href="/employee/login">Employee Login</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(isScrolled && "lg:hidden")}
          >
            <Link href="/admin/login">Admin Login</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(isScrolled && "lg:hidden")}
          >
            <Link href="/onboarding">Admin Sign Up</Link>
          </Button>

          <Button
            asChild
            size="sm"
            className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
          >
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </>
      )}
    </>
  );
}
