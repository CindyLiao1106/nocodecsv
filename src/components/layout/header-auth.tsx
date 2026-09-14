"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/** 只有登录/用户按钮这一小块是客户端组件 —— 导航其余部分是服务端渲染。 */
export function HeaderAuth() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <>
        <SignInButton mode="modal">
          <Button size="sm" variant="ghost" className="hidden sm:flex">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm">Sign Up Free</Button>
        </SignUpButton>
      </>
    );
  }

  return (
    <UserButton
      appearance={{
        elements: { avatarBox: "h-8 w-8" },
      }}
    />
  );
}
