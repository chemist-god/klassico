"use client";

import { Product } from "@/lib/api/types";
import { AlertDialog, AlertDialogContent, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { getBankLogo } from "@/lib/utils/bank-logos";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Banknote, MapPin, Building2, Wallet, ShieldCheck, Calendar } from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailsModal({ product, open, onOpenChange }: ProductDetailsModalProps) {
  if (!product) return null;

  const bankLogo = getBankLogo(product.bank);
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl p-0 overflow-hidden">
        {/* Header Section with Bank Logo */}
        <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-8 pb-6">
          <div className="flex items-start gap-6">
            {bankLogo && (
              <div className="relative w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center p-3 shrink-0 ring-1 ring-black/5">
                <Image
                  src={bankLogo}
                  alt={product.bank}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-2xl font-bold text-foreground leading-tight">
                  {product.name}
                </h2>
                <Badge 
                  variant={product.status === "Available" ? "default" : "secondary"}
                  className="shrink-0 px-3 py-1 text-sm font-medium"
                >
                  {product.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{product.bank}</span>
                <span className="text-muted-foreground/50">•</span>
                <MapPin className="w-4 h-4" />
                <span>{product.region}</span>
              </div>
              <div className="inline-flex items-baseline gap-3 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-6 space-y-6">
          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Account Balance</span>
              </div>
              <p className="text-2xl font-bold text-foreground pl-13">
                ${product.balance.toLocaleString()}
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Account Type</span>
              </div>
              <p className="text-2xl font-bold text-foreground pl-13">
                {product.type}
              </p>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  Product Details
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </>
          )}

          {/* Metadata */}
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Listed on {formatDate(product.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Last updated {formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-muted/20 px-8 py-6 border-t border-border/50">
          <div className="flex items-center justify-between gap-4">
            <AlertDialogCancel className="flex-1">
              Close
            </AlertDialogCancel>
            <div className="flex-1">
              <AddToCartButton 
                productId={product.id} 
                onAddedToCart={() => onOpenChange(false)}
              />
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
