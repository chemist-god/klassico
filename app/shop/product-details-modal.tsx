"use client";

import { Product } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogClose,
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
  CheckCircle2,
  Share2,
  Star
} from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
      <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-transparent shadow-none sm:rounded-[32px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-auto md:max-h-[85vh] rounded-[32px]"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-30 pointer-events-none" />

          {/* Close Button - absolute positioning for global access */}
          <DialogClose className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-muted-foreground/70" />
          </DialogClose>

          {/* Left Column: Brand & Visuals */}
          <div className="w-full md:w-2/5 bg-muted/30 p-8 md:p-10 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-border/50">
            <div className="space-y-8 relative z-10">
              {/* Brand Logo Area */}
              <div className="aspect-square w-24 md:w-32 rounded-[2rem] bg-white shadow-2xl shadow-primary/5 flex items-center justify-center p-6 mx-auto md:mx-0 ring-1 ring-black/5">
                {bankLogo ? (
                  <Image
                    src={bankLogo}
                    alt={product.bank}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-4 text-center md:text-left">
                <div>
                  <Badge variant="outline" className="mb-3 px-3 py-1 bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
                    {product.type}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {product.name}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-background/40 px-3 py-1.5 rounded-full border border-border/50">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{product.bank}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-background/40 px-3 py-1.5 rounded-full border border-border/50">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{product.region}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Badge */}
            <div className="mt-8 md:mt-0 flex items-center justify-center md:justify-start gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-3 rounded-2xl w-fit">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-semibold text-sm">Verified & Secure Product</span>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex-1 p-8 md:p-10 overflow-y-auto no-scrollbar flex flex-col">
            <div className="flex-1 space-y-8">
              {/* Header Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground/80 uppercase tracking-wide">Balance</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground tracking-tight">
                    ${product.balance.toLocaleString()}
                  </p>
                </div>
                <div className="bg-muted/40 rounded-3xl p-6 border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground/80 uppercase tracking-wide">Price</span>
                  </div>
                  <p className="text-3xl font-bold text-primary tracking-tight">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Product Overview
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Enhanced Features List (Mocked for now based on typical properties) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Included Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Instant Delivery", "Full Access Credentials", "24/7 Support", "Guwop Warranty"].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/20 px-3 py-2 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-muted-foreground border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Listed {formatDate(product.createdAt)}
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div>ID: {product.id.slice(0, 8)}...</div>
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-4 items-center">
              <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl h-12 border-border/50 hover:bg-muted/40 font-medium">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <div className="w-full flex-1">
                <AddToCartButton
                  productId={product.id}
                  onAddedToCart={() => onOpenChange(false)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
