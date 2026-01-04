"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle } from "lucide-react";
import { CartTable } from "./cart-table";
import { CartItem } from "@/lib/api/types";
import { createOrder } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

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

    toast({
      variant: "destructive",
      title: "Item Expired ⏰",
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove expired item.",
        duration: 4000,
      });
    }
  };

    const handleProceedToCheckout = async () => {
        if (hasInsufficientBalance) {
            toast({
                variant: "destructive",
                title: "Insufficient Balance",
                description: "Please top up your account to proceed with checkout.",
                duration: 4000,
            });
            return;
        }

        setIsProcessing(true);
        try {
            const cartItemIds = cartItems.map((item) => item.id);
            const result = await createOrder(cartItemIds);

            if (result.success) {
                // Clear all cart item timers on successful checkout
                cartItems.forEach((item) => {
                  clearCartItemTimer(item.id);
                });
                
                toast({
                    variant: "success",
                    title: "Order Created! 🎉",
                    description: "Your order has been successfully created.",
                    duration: 3000,
                });

                // Redirect to orders page
                setTimeout(() => {
                    router.push("/user/orders");
                    router.refresh();
                }, 1000);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to create order.",
                    duration: 4000,
                });
            }
        } catch (error) {
            console.error("Error creating order:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred while creating the order.",
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
            <div className="flex justify-end">
                <div className="w-full max-w-md space-y-4">
                    {/* Total Amount */}
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-sm text-muted-foreground">Total Amount:</span>
                        <span className="text-3xl font-bold">
                            ${total.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>

                    {/* Proceed to Checkout Button */}
                    <Button
                        onClick={handleProceedToCheckout}
                        disabled={isProcessing || hasInsufficientBalance || cartItems.length === 0}
                        className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 py-6 text-lg font-semibold"
                        size="lg"
                    >
                        <FileText className="w-5 h-5" />
                        {isProcessing ? "Processing..." : "Proceed to Checkout"}
                    </Button>

                    {/* Insufficient Balance Error */}
                    {hasInsufficientBalance && (
                        <div className="flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Insufficient balance. Please top up your account.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

