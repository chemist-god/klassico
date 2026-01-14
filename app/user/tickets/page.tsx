import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { getTickets } from "@/lib/actions/tickets";
import { TicketsList } from "./tickets-list";
import { CreateTicketButton } from "./create-ticket-button";

export default async function TicketsPage() {
  const result = await getTickets();
  const tickets = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Support Chat</h1>
          <p className="text-muted-foreground text-lg font-light">Get help from our support team</p>
        </div>

        {tickets.length === 0 ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border/50 rounded-3xl bg-muted/5">
              <div className="w-16 h-16 rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Active Chat</h3>
              <p className="text-muted-foreground mb-6 max-w-sm text-center">
                Start a conversation with our support team to get assistance with your orders or account.
              </p>
              <CreateTicketButton />
            </div>
          </div>
        ) : (
          <TicketsList tickets={tickets} />
        )}
      </div>
    </main>
  );
}
