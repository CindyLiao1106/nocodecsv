import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — NoCodeCSV",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm",
            card: "shadow-none border border-zinc-200 rounded-xl",
          },
        }}
      />
    </div>
  );
}
