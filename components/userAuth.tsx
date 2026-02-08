
"use client";

import { Button } from "./ui/button";
import { ModeToggle } from "./ui/ModeToggle";
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = { isScrolled: boolean; };

export default function UserAuthClient({
  isScrolled,
}: Props) {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const profileRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user && profileRef.current) {
      gsap.fromTo(profileRef.current, 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return null; // Or a small spinner
  }

  return (
    <>
      <ModeToggle />
      
      {isAuthenticated && user ? (
        <div ref={profileRef} className="ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                  <AvatarImage src={user.picture || ""} alt={user.given_name || "User"} />
                  <AvatarFallback>{user.given_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.given_name} {user.family_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <LogoutLink className="cursor-pointer text-destructive focus:text-destructive">Log out</LogoutLink>
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
            <LoginLink>Login</LoginLink>
          </Button>

          <Button
            asChild
            size="sm"
            className={cn(isScrolled && "lg:hidden")}
          >
            <RegisterLink>Sign Up</RegisterLink>
          </Button>

          <Button
            asChild
            size="sm"
            className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
          >
            <RegisterLink>Get Started</RegisterLink>
          </Button>
        </>
      )}
    </>
  );
}
