"use client";

import { useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

// sessionStorage keys used to detect sign-in/sign-up/sign-out transitions across renders
const AUTH_INTENT_KEY = "ls-auth-intent";
const AUTH_SIGNED_IN_KEY = "ls-auth-signed-in";

export function Header() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const previouslySignedIn = sessionStorage.getItem(AUTH_SIGNED_IN_KEY);
    sessionStorage.setItem(AUTH_SIGNED_IN_KEY, String(isSignedIn));

    // nothing to compare against on the first load in this tab
    if (previouslySignedIn === null) return;

    const wasSignedIn = previouslySignedIn === "true";
    if (isSignedIn && !wasSignedIn) {
      const intent = sessionStorage.getItem(AUTH_INTENT_KEY);
      sessionStorage.removeItem(AUTH_INTENT_KEY);
      toast.success(
        intent === "sign-up"
          ? "Account created successfully."
          : "Signed in successfully.",
      );
    } else if (!isSignedIn && wasSignedIn) {
      toast.success("Signed out successfully.");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-6 py-3">
      <Link href="/" className="text-lg font-semibold">
        Link Shortener
      </Link>
      <div className="flex items-center gap-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button
              variant="outline"
              onClick={() =>
                sessionStorage.setItem(AUTH_INTENT_KEY, "sign-in")
              }
            >
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button
              onClick={() =>
                sessionStorage.setItem(AUTH_INTENT_KEY, "sign-up")
              }
            >
              Sign Up
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
