"use client";

import { useRequireAuth } from "@/lib/auth/use-require-auth";
import { useRouter } from "next/navigation";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isLoading } = useRequireAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}