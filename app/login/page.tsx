"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const result = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    alert("Logged in successfully!");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">

      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-foreground" />

        <span className="text-lg font-semibold tracking-tight">
          EchoChat
        </span>
      </div>

      {/* Welcome */}
      <div className="mb-8 max-w-md text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Welcome back
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to continue to EchoChat.
        </p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md border-border/60 bg-card/80 shadow-2xl shadow-black/20">

        <CardHeader className="space-y-2">
          <CardTitle className="text-xl">
            Sign in
          </CardTitle>

          <CardDescription>
            Enter your email and password to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-5"
          >

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}

            <Link
              href="/signup"
              className="font-medium text-foreground hover:underline"
            >
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground">
        By continuing, you agree to our terms and privacy policy.
      </p>

    </main>
  );
}