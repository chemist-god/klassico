import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { getOrders } from "@/lib/actions/orders";
import { OrdersList } from "./orders-list";

export default async function OrdersPage() {
  const result = await getOrders();
  const orders = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Orders</h1>
          <p className="text-muted-foreground text-lg font-light">Track and manage your purchase history</p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border/50 rounded-3xl bg-muted/5">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No orders yet</h3>
            <p className="text-muted-foreground mb-6 max-w-xs text-center">
              {"You haven't purchased any items yet. Check out the shop to get started."}
            </p>
            <Button asChild className="rounded-full px-6 h-11 font-medium">
              <a href="/shop">
                Browse Shop
              </a>
            </Button>
          </div>
        ) : (
          <OrdersList orders={orders} />
        )}
      </div>
    </main>
  );
}
