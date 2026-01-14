"use client";

import { Product } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBankLogo } from "@/lib/utils/bank-logos";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Wallet,
  ShieldCheck,
  Calendar,
  X,
  CreditCard,
  Share2,
} from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border border-border/50 shadow-2xl sm:rounded-2xl gap-0 bg-background">
        <DialogTitle className="sr-only">{product.name} Details</DialogTitle>
        <div className="relative">
          {/* Header / Brand Section */}
          <div className="bg-muted/30 border-b border-border/50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-background border border-border/50 shadow-sm flex items-center justify-center p-3">
              {bankLogo ? (
                <Image
                  src={bankLogo}
                  alt={product.bank}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <Building2 className="w-8 h-8 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{product.name}</h2>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    product.status === "Available"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  )}
                >
                  {product.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 opacity-70" />
                  <span className="font-medium text-foreground/80">{product.bank}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 opacity-70" />
                  <span>{product.region}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div>{product.type}</div>
              </div>
            </div>

            <DialogClose className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/60 transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </DialogClose>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Balance</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  ${product.balance.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                  ${product.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Details & Features */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Product Assurance
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This verified account is covered by our 30-day warranty. You will receive full access credentials immediately after purchase securely.
                </p>
              </div>

              {product.description && (
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Additional Notes</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-4 border-t border-border/50">
              <div className="w-full sm:w-auto text-xs text-muted-foreground flex items-center gap-2 justify-center sm:justify-start">
                <Calendar className="w-3.5 h-3.5" />
                <span>Added {formatDate(product.createdAt)}</span>
              </div>

              <div className="flex-1 w-full flex items-center gap-3 justify-end">
                <Button variant="outline" className="gap-2 border-border/50">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <div className="flex-1 sm:flex-none sm:min-w-[160px]">
                  <AddToCartButton
                    productId={product.id}
                    onAddedToCart={() => onOpenChange(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
