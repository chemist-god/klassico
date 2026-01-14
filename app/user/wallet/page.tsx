import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWallet } from "@/lib/actions/wallet";
import { GenerateWalletButton } from "./generate-wallet-button";
import { WalletAddressDisplay } from "./wallet-address-display";
import { HowToTopUp } from "./how-to-top-up";

export default async function WalletPage() {
  const result = await getWallet();
  const wallet = result.success && result.data ? result.data : null;

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Wallet</h1>
          <p className="text-muted-foreground text-lg font-light">Manage your account balance and top up funds</p>
        </div>

        {/* Current Balance Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardContent className="p-10 flex flex-col items-center">
            <div className="mb-6 p-4 rounded-full bg-primary/10 ring-1 ring-primary/20">
              <svg width="32" height="32" fill="none" className="text-primary" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Current Balance</span>
            <span className="text-5xl font-bold text-foreground tracking-tight">
              ${wallet ? wallet.balance.toFixed(2) : "0.00"}
            </span>
          </CardContent>
        </Card>

        {/* Top Up Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardContent className="p-8">
            {wallet?.address ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Wallet Details</h3>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    Active
                  </Badge>
                </div>
                <WalletAddressDisplay address={wallet.address} />
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    Setup Required
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Top Up Your Balance</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Generate a unique crypto wallet address to start receiving payments securely.
                </p>
                <div className="flex justify-center">
                  <GenerateWalletButton />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How to Top Up Instructions */}
        {wallet?.address && (
          <Card>
            <CardContent className="p-6">
              <HowToTopUp />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
