"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/actions/auth";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { CaptchaInput } from "@/components/captcha/captcha-input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    captchaAnswer: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login({
        username: formData.username,
        password: formData.password,
        captchaAnswer: formData.captchaAnswer,
      });

      if (result.success && result.data) {
        // Get redirect URL from query params or default to dashboard
        const redirectUrl = searchParams.get("redirect") || ROUTES.DASHBOARD;
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(result.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login form error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      <Input
        placeholder="Username"
        required
        value={formData.username}
        onChange={(e) =>
          setFormData({ ...formData, username: e.target.value })
        }
        disabled={isLoading}
      />
      <Input
        placeholder="Password"
        type="password"
        required
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        disabled={isLoading}
      />
      <CaptchaInput
        value={formData.captchaAnswer}
        onChange={(value) => setFormData({ ...formData, captchaAnswer: value })}
        disabled={isLoading}
        error={error && (error.toLowerCase().includes("captcha") || error.toLowerCase().includes("expired")) ? error : null}
      />
      <Button className="w-full mt-2" type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

