export const dynamic = "force-dynamic";

import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { getProducts } from "@/lib/actions/products";
import { Product } from "@/lib/api/types";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as motion from "framer-motion/client";

export default async function ShopPage() {
  const result = await getProducts();
  const products: Product[] = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Aligned with Dashboard layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Marketplace
            </h1>
            <p className="text-muted-foreground text-lg font-light max-w-2xl">
              Discover verified premium accounts and financial products.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full border border-border/50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-foreground">{products.length}</span> Products Live
            </div>
          </div>
        </motion.div>

        {/* Filters Bar - Integrated and Clean */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sticky top-4 z-30 bg-background/80 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-3"
        >
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10 h-10 bg-muted/40 border-border/50 focus-visible:bg-background transition-colors"
                placeholder="Search products..."
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 px-1 lg:px-0 no-scrollbar">
              <Select>
                <SelectTrigger className="w-[140px] h-10 bg-muted/40 border-border/50">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[140px] h-10 bg-muted/40 border-border/50">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="asc">Low to High</SelectItem>
                  <SelectItem value="desc">High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="h-10 px-4 gap-2 bg-muted/40 border-border/50 hover:bg-muted/60">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Advanced</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/50 rounded-3xl bg-muted/5">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">No Products Found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product, index: number) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
