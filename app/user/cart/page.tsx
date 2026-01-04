import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, AlertCircle } from "lucide-react";
import { getCart } from "@/lib/actions/cart";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { CartTable } from "./cart-table";
import { CartPageClient } from "./cart-page-client";

export default async function CartPage() {
  const [cartResult, statsResult] = await Promise.all([
    getCart(),
    getDashboardStats(),
  ]);

  const cartItems = cartResult.success && cartResult.data ? cartResult.data : [];
  const stats = statsResult.success && statsResult.data ? statsResult.data : {
    availableFunds: 0,
    totalCompleted: 0,
    awaitingProcessing: 0,
  };

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const hasInsufficientBalance = stats.availableFunds < total;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Review your items before checkout
              </p>
            </div>
          </div>

          {/* Balance Display */}
          <div className="flex items-center gap-2 text-green-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">
              Balance Available: ${stats.availableFunds.toFixed(2)}
            </span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <Card className="p-12 flex flex-col items-center w-full">
            <CardContent className="flex flex-col items-center">
              <svg
                width="48"
                height="48"
                fill="none"
                className="mb-4 text-primary"
              >
                <rect width="48" height="48" rx="12" fill="var(--card)" />
                <path
                  d="M16 24h16M16 28h16M16 20h16"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xl font-semibold mb-2">Your cart is empty</span>
              <span className="mb-4 text-muted-foreground">
                Start shopping to add items to your cart
              </span>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95"
              >
                <a href="/user/dashboard">
                  <ShoppingCart className="w-4 h-4" />
                  Continue Shopping
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <CartPageClient
            initialCartItems={cartItems}
            availableFunds={stats.availableFunds}
            total={total}
            hasInsufficientBalance={hasInsufficientBalance}
          />
        )}
      </div>
    </main>
  );
}
