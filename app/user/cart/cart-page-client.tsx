"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle } from "lucide-react";
import { CartTable } from "./cart-table";
import { CartItem } from "@/lib/api/types";
import { createOrder } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";
import { toast, toastError } from "@/lib/utils/toast";
import { removeFromCart } from "@/lib/actions/cart";
import {
  clearCartItemTimer,
  getCartItemTimer,
  setCartItemTimer,
} from "@/lib/utils/cart-timers";

interface CartPageClientProps {
  initialCartItems: CartItem[];
  availableFunds: number;
  total: number;
  hasInsufficientBalance: boolean;
}

export function CartPageClient({
  initialCartItems,
  availableFunds,
  total: initialTotal,
  hasInsufficientBalance: initialHasInsufficientBalance,
}: CartPageClientProps) {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Initialize timers for items that don't have one yet
  useEffect(() => {
    initialCartItems.forEach((item) => {
      const existingTimer = getCartItemTimer(item.id);
      if (!existingTimer) {
        // Item doesn't have a timer, initialize it now
        setCartItemTimer(item.id);
      }
    });
  }, [initialCartItems]);

  // Recalculate total when cart items change
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const hasInsufficientBalance = availableFunds < total;

  /**
   * Handle individual item expiration - remove only that item
   */
  const handleItemExpired = async (itemId: string) => {
    const expiredItem = cartItems.find((item) => item.id === itemId);
    if (!expiredItem) return;

    const itemName = expiredItem.product.name || "Item";

    toastError("Item Expired ⏰", {
      description: `${itemName} has expired and has been removed from your cart.`,
      duration: 5000,
    });

    try {
      // Remove the expired item
      await removeFromCart(itemId);

      // Clear the item's timer
      clearCartItemTimer(itemId);

      // Remove from local state
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing expired item:", error);
      toastError("Error", {
        description: "Failed to remove expired item.",
        duration: 4000,
      });
    }
  };

  const handleProceedToCheckout = async () => {
    setIsProcessing(true);
    try {
      const cartItemIds = cartItems.map((item) => item.id);
      
      // Step 1: Create order
      const orderResult = await createOrder(cartItemIds);

      if (!orderResult.success || !orderResult.data) {
        toast.error("Error", {
          description: orderResult.error || "Failed to create order.",
          duration: 4000,
        });
        return;
      }

      const order = orderResult.data;

      // Step 2: Create payment
      const { createOrderPayment } = await import("@/lib/actions/orders");
      const paymentResult = await createOrderPayment(order.id);

      if (!paymentResult.success) {
        toast.error("Error", {
          description: paymentResult.error || "Failed to initialize payment.",
          duration: 4000,
        });
        return;
      }

      // Clear all cart item timers on successful checkout
      cartItems.forEach((item) => {
        clearCartItemTimer(item.id);
      });

      toast.success("Order Created! 🎉", {
        description: "Redirecting to payment...",
        duration: 2000,
      });

      // Redirect to payment page
      router.push(`/user/orders/${order.id}/pay`);
      router.refresh();
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Error", {
        description: "An unexpected error occurred during checkout.",
        duration: 4000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cart Table */}
      <CartTable
        cartItems={cartItems}
        onItemsChange={setCartItems}
        onItemExpired={handleItemExpired}
      />

      {/* Summary and Checkout Section */}
      <div className="flex justify-end pt-4">
        <div className="w-full max-w-md space-y-6 p-6 md:p-8 rounded-3xl bg-card/50 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">{cartItems.length} Items</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Processing Fee</span>
              <span>$0.00</span>
            </div>
            <div className="h-px bg-border/50 my-2" />
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-foreground">Total Amount</span>
              <span className="text-3xl font-bold text-primary tracking-tight">
                ${total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Proceed to Checkout Button */}
          <div className="space-y-3">
            <Button
              onClick={handleProceedToCheckout}
              disabled={isProcessing || cartItems.length === 0}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 text-lg font-semibold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Checkout with Crypto
                </>
              )}
            </Button>

            {/* Payment Info */}
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
              <span className="font-medium leading-tight text-muted-foreground">
                You will be redirected to complete payment with cryptocurrency
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

