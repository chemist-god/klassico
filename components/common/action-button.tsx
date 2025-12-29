"use client";

import { Button } from "@/components/ui/button";
import { useState, ReactNode } from "react";
import { ActionResult } from "@/lib/utils/result";
import { useRouter } from "next/navigation";

interface ActionButtonProps {
  action: () => Promise<ActionResult<unknown>>;
  children: ReactNode;
  loadingText?: string;
  onSuccess?: () => void;
  refreshOnSuccess?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  icon?: ReactNode;
}

/**
 * Reusable button component for server actions
 */
export function ActionButton({
  action,
  children,
  loadingText,
  onSuccess,
  refreshOnSuccess = false,
  variant = "default",
  size = "default",
  className,
  icon,
}: ActionButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setIsLoading(true);

    try {
      const result = await action();
      if (result.success) {
        if (refreshOnSuccess) {
          router.refresh();
        }
        onSuccess?.();
      } else {
        setError(result.error || "Action failed");
      }
    } catch (error) {
      console.error("Action error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}
      <Button
        onClick={handleClick}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {isLoading ? loadingText || "Loading..." : children}
      </Button>
    </div>
  );
}

