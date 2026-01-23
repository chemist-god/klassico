"use client";

import { ActionButton } from "@/components/common/action-button";
import { ShoppingCart, Check } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";
import { toast, toastError } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
import { setCartItemTimer } from "@/lib/utils/cart-timers";
import { Button } from "@/components/ui/button";

interface CartItemData {
  id: string;
  quantity: number;
  product: {
    name: string;
  };
}

interface AddToCartButtonProps {
  productId: string;
  isInCart?: boolean;
  onAddedToCart?: () => void;
}

export function AddToCartButton({ productId, isInCart = false, onAddedToCart }: AddToCartButtonProps) {
  const router = useRouter();

  const handleAddToCart = async () => {
    const result = await addToCart(productId, 1);

    if (result.success && result.data) {
      const cartItem = result.data as CartItemData;
      const productName = cartItem.product?.name || "Item";

      // Check if item was updated (already in cart) or newly added
      // If quantity > 1, it means it was already in cart and quantity was incremented
      const isUpdate = cartItem.quantity > 1;

      if (isUpdate) {
        // Item already in cart, quantity updated - don't redirect
        toast("Quantity Updated ✨", {
          description: `${productName} is already in your cart. Quantity increased to ${cartItem.quantity}.`,
          duration: 3000,
        });
      } else {
        // New item added - set timer for this item and redirect
        // Set timer for this new cart item (starts countdown)
        setCartItemTimer(cartItem.id);

        // Notify parent component that item was added
        if (onAddedToCart) {
          onAddedToCart();
        }

        toast.success("Product Added to Cart! 🎉", {
          description: "Redirecting to cart...",
          duration: 2000,
        });

        // Redirect to cart page after a short delay
        setTimeout(() => {
          router.push("/user/cart");
        }, 500);
      }
    } else {
      // Handle different error scenarios
      const errorMessage = result.error || "Failed to add item to cart";

      if (errorMessage.includes("sold") || errorMessage.includes("already been sold")) {
        toastError("Not Available ❌", {
          description: "This product has already been sold and is no longer available.",
          duration: 4000,
        });
      } else if (
        errorMessage.includes("being processed") ||
        errorMessage.includes("Pending") ||
        errorMessage.includes("currently being processed")
      ) {
        toastError("Currently Unavailable ⏳", {
          description: "This product is being processed and cannot be added to cart right now.",
          duration: 4000,
        });
      } else if (errorMessage.includes("not found")) {
        toastError("Product Not Found", {
          description: "The product you're trying to add is no longer available.",
          duration: 4000,
        });
      } else {
        toastError("Error", {
          description: errorMessage,
          duration: 4000,
        });
      }
    }

    return result;
  };

  // If item is already in cart, show "Added to Cart" state
  if (isInCart) {
    return (
      <Button
        disabled
        className="w-full bg-green-500/10 hover:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 flex items-center justify-center gap-2 rounded-xl cursor-not-allowed shadow-sm"
      >
        <Check className="w-4 h-4" />
        Added to Cart
      </Button>
    );
  }

  return (
    <ActionButton
      action={handleAddToCart}
      loadingText="Adding to Cart..."
      className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      icon={<ShoppingCart className="w-4 h-4" />}
    >
      Add to Cart
    </ActionButton>
  );
}

