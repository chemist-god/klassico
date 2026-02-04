"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Order, OrderItem } from "@/lib/api/types";
import { Eye, ChevronRight, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { cancelOrder } from "@/lib/actions/orders";

export function OrdersList({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string, receiptNumber?: string | null) => {
    setCancellingOrderId(orderId);
    try {
      const result = await cancelOrder(orderId);
      
      if (result.success) {
        toast.success("Order Cancelled", {
          description: `Order #${receiptNumber || orderId.slice(0, 8)} has been cancelled.`,
        });
        router.refresh();
      } else {
        toast.error("Failed to Cancel", {
          description: result.error || "Something went wrong",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to cancel order. Please try again.",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      {orders.map((order: Order) => (
        <Card 
          key={order.id}
          className={cn(
            "p-6 transition-all duration-200",
            "hover:shadow-lg hover:border-primary/50",
          )}
        >
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <Link href={`/user/orders/${order.id}`} className="flex-1 cursor-pointer">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {order.receiptNumber && (
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {order.receiptNumber}
                    </p>
                  )}
                </div>
              </Link>
              <div className="flex flex-col items-end gap-2">
                <Badge 
                  variant="secondary"
                  className={cn(
                    order.status === 'Pending' && "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                    order.status === 'Completed' && "bg-green-500/10 text-green-600 border-green-500/20",
                    order.status === 'Cancelled' && "bg-red-500/10 text-red-600 border-red-500/20",
                  )}
                >
                  {order.status}
                </Badge>

                {/* Cancel button for pending orders */}
                {order.status === 'Pending' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                        disabled={cancellingOrderId === order.id}
                      >
                        {cancellingOrderId === order.id ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>
                            Are you sure you want to cancel this order? This action cannot be undone.
                          </p>
                          <p className="text-sm">
                            <strong>Order:</strong> #{order.receiptNumber || order.id.slice(0, 8)}
                            <br />
                            <strong>Amount:</strong> ${order.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Products in this order will be released and become available again.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Order</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelOrder(order.id, order.receiptNumber)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, Cancel Order
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
            
            <Link href={`/user/orders/${order.id}`} className="block cursor-pointer">
              <div className="space-y-2">
                {order.items.slice(0, 3).map((item: OrderItem) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-xs text-muted-foreground italic">
                    +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">
                  ${order.total.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>Click to view full receipt</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
