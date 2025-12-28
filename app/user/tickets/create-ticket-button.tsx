"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { createTicket } from "@/lib/actions/tickets";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateTicketButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    setIsLoading(true);
    try {
      const result = await createTicket({
        subject: "Support Request",
        message: "I need help with my account.",
      });
      if (result.success) {
        router.refresh();
      } else {
        console.error("Failed to create ticket:", result.error);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCreate}
      disabled={isLoading}
      className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95"
    >
      <MessageCircle className="w-4 h-4" />
      {isLoading ? "Creating..." : "Open Chat"}
    </Button>
  );
}

