/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "./ui/button";
import { ModeToggle } from "./ui/ModeToggle";
import {
  LoginLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { cn } from "@/lib/utils";

type Props = {
  isScrolled: boolean;
};

export default function UserAuthClient({
  isScrolled,
}: Props) {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const isAuthed = Boolean(isAuthenticated && user);

  if (isLoading) {
    return null;
  }
  return (
    <>
      {isAuthed ? (
        <div className="flex flex-row justify-center items-center gap-3">
        <img
          src={user?.picture}
          alt={user?.given_name || "user"}
          width={32}
          height={32}
          className="rounded-full"
        />
        <h5>{user?.given_name}</h5>
        </div>
      ) : (
        <>
          <ModeToggle />

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
