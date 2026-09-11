"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <span className="hidden sm:inline">NoCodeCSV</span>
          <span className="sm:hidden">NC</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <Link href="/#features" className="text-sm text-zinc-600 hover:text-zinc-900 hidden md:block">Features</Link>
          <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-900 hidden sm:block">Pricing</Link>
          <Link href="/dashboard">
            <Button size="sm" variant="outline">Dashboard</Button>
          </Link>

          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button size="sm" variant="ghost" className="hidden sm:flex">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up Free</Button>
              </SignUpButton>
            </>
          ) : (
            <UserButton
              appearance={{
                elements: { avatarBox: "h-8 w-8" },
              }}
            />
          )}
        </nav>
      </div>
    </header>
  );
}
