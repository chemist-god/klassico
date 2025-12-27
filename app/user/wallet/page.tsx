import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WalletPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
        <p className="mb-8 text-muted-foreground">Manage your account balance and top up funds</p>
        <Card className="p-10 flex flex-col items-center w-full mb-6">
          <CardContent className="flex flex-col items-center">
            <svg width="48" height="48" fill="none" className="mb-4 text-primary"><rect width="48" height="48" rx="12" fill="var(--card)"/><circle cx="24" cy="24" r="12" stroke="#0ea5e9" strokeWidth="2"/></svg>
            <span className="text-lg mb-2">Current Balance</span>
            <span className="text-3xl font-bold text-primary mb-4">$0.00</span>
          </CardContent>
        </Card>
        <Card className="w-full p-0 overflow-hidden border-none shadow-xl bg-gradient-to-br from-stone-950 to-stone-900">
          <div className="flex flex-col md:flex-row items-center gap-0 md:gap-6 p-6">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs font-semibold bg-yellow-500/10 text-yellow-400 px-2 py-1">Wallet Setup Required</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-1 text-foreground">Top Up Your Balance</h3>
              <div className="text-xs text-muted-foreground mb-3">Generate a wallet address to start receiving payments.</div>
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white rounded-full font-semibold shadow transition-transform duration-150 active:scale-95">Generate Wallet Address</Button>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <svg width="64" height="64" fill="none" className="text-primary"><rect width="64" height="64" rx="16" fill="var(--card)"/><circle cx="32" cy="32" r="18" stroke="#0ea5e9" strokeWidth="3"/></svg>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
