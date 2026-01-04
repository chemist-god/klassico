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
  const [cartStartTime, setCartStartTime] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Initialize cart start time when component mounts (only if cart has items)
  useEffect(() => {
    if (initialCartItems.length === 0) {
      // Cart is empty, clear any existing timer
      localStorage.removeItem("cartStartTime");
      setCartStartTime(null);
      return;
    }

    const storedTime = localStorage.getItem("cartStartTime");
    if (storedTime) {
      // Timer already exists, use it
      setCartStartTime(parseInt(storedTime, 10));
    } else {
      // First time viewing cart with items, set start time
      const startTime = Date.now();
      localStorage.setItem("cartStartTime", startTime.toString());
      setCartStartTime(startTime);
    }
  }, [initialCartItems.length]);

  // Recalculate total when cart items change
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const hasInsufficientBalance = availableFunds < total;

  /**
   * Handle cart expiration - clear all items
   */
  const handleCartExpired = async () => {
    if (cartItems.length === 0) {
      // Cart already empty, just clear the timer
      localStorage.removeItem("cartStartTime");
      setCartStartTime(null);
      return;
    }

    toast({
      variant: "destructive",
      title: "Cart Expired ⏰",
      description: "Your cart has expired and has been cleared. Please add items again.",
      duration: 5000,
    });

    // Remove all cart items
    try {
      await Promise.all(
        cartItems.map((item) => removeFromCart(item.id))
      );
      
      // Clear cart start time
      localStorage.removeItem("cartStartTime");
      setCartStartTime(null);
      
      // Clear local state
      setCartItems([]);
      
      // Refresh page to show empty cart
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error clearing expired cart:", error);
    }
  };

  // Reset timer when cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0 && cartStartTime) {
      localStorage.removeItem("cartStartTime");
      setCartStartTime(null);
    } else if (cartItems.length > 0 && !cartStartTime) {
      // Cart has items but no timer - set it now
      const startTime = Date.now();
      localStorage.setItem("cartStartTime", startTime.toString());
      setCartStartTime(startTime);
    }
  }, [cartItems.length, cartStartTime]);

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
                // Clear cart timer on successful checkout
                localStorage.removeItem("cartStartTime");
                setCartStartTime(null);
                
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
        onCartExpired={handleCartExpired}
        cartStartTime={cartStartTime}
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

