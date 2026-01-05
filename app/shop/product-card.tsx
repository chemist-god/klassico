"use client";

import { useState } from "react";
import { Product } from "@/lib/api/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Wallet, Sparkles } from "lucide-react";
import { getBankLogo } from "@/lib/utils/bank-logos";
import Image from "next/image";
import { ProductDetailsModal } from "./product-details-modal";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const bankLogo = getBankLogo(product.bank);

  return (
    <>
      <Card 
        className={cn(
          "group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10",
          "bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm",
          "border-border/50 hover:border-primary/30",
          "hover:-translate-y-1"
        )}
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-500",
          isHovered && "opacity-100"
        )} />

        {/* Shimmer Effect */}
        <div className={cn(
          "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
          "bg-gradient-to-r from-transparent via-white/10 to-transparent"
        )} />

        {/* Content */}
        <div className="relative p-6 space-y-4">
          {/* Header with Logo and Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {bankLogo ? (
                <div className="relative w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center p-2 shrink-0 ring-1 ring-black/5 group-hover:shadow-lg transition-shadow">
                  <Image
                    src={bankLogo}
                    alt={product.bank}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{product.type}</p>
              </div>
            </div>
            <Badge 
              variant={product.status === "Available" ? "default" : "secondary"}
              className="shrink-0 shadow-sm"
            >
              {product.status}
            </Badge>
          </div>

          {/* Bank and Region Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span className="truncate">{product.bank}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{product.region}</span>
            </div>
          </div>

          {/* Balance Highlight */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Account Balance
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${product.balance.toLocaleString()}
            </p>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Price</span>
              <span className="text-2xl font-bold text-primary">
                ${product.price.toLocaleString()}
              </span>
            </div>
            <Button
              size="sm"
              className={cn(
                "gap-2 shadow-lg transition-all duration-300",
                isHovered && "shadow-primary/30 scale-105"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <Sparkles className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>

      {/* Product Details Modal */}
      <ProductDetailsModal 
        product={product}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
