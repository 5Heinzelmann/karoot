"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentCarrot } from "@/components/illustrations/carrot-characters/student-carrot";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-carrot-pale shadow-carrot-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <StudentCarrot size={50} />
          </div>
          <CardTitle className="text-3xl font-heading text-carrot">Welcome Back!</CardTitle>
          <CardDescription className="font-ui text-soil">
            Enter your credentials to access your carrot garden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-ui font-medium text-soil">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-body border-carrot-light focus:border-carrot focus:ring-carrot/20"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-ui font-medium text-soil">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm font-ui text-carrot hover:text-carrot-dark underline-offset-4 hover:underline transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-body border-carrot-light focus:border-carrot focus:ring-carrot/20"
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-feedback-error/10 border border-feedback-error/20 text-feedback-error text-sm font-ui">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full py-3 bg-carrot hover:bg-carrot-dark text-white font-ui font-semibold rounded-lg shadow-carrot transition-all duration-200 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm font-ui text-soil">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-carrot hover:text-carrot-dark underline-offset-4 hover:underline transition-colors font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
