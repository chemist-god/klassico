export const dynamic = "force-dynamic";

import { Input } from "@/components/ui/input";
import { Search, Wallet, Building2, MapPin, TrendingUp, Sparkles, Filter } from "lucide-react";
import { getProducts } from "@/lib/actions/products";
import { Product } from "@/lib/api/types";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";

export default async function ShopPage() {
  const result = await getProducts();
  const products: Product[] = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/3" />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20">
        {/* Hero / Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>Premium Marketplace</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground">
              Discover <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">Premium</span> <br /> Products
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Explore our curated collection of high-value verified accounts and financial products. Secure, instant, and reliable.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:justify-end">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
              <span className="text-3xl font-bold text-foreground">{products.length}</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Products</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
              <span className="text-3xl font-bold text-foreground">{new Set(products.map(p => p.bank)).size}</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Banks</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
              <span className="text-3xl font-bold text-foreground">{new Set(products.map(p => p.region)).size}</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Regions</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="sticky top-4 z-40 mb-10">
          <div className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5 rounded-2xl p-2 flex flex-col lg:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                className="pl-12 h-12 bg-transparent border-transparent focus-visible:ring-0 focus-visible:bg-muted/30 text-base rounded-xl"
                placeholder="Search by name, bank, or region..."
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 px-2 lg:px-0 no-scrollbar">
              <Button variant="ghost" className="h-12 px-4 rounded-xl gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <div className="w-px h-8 my-auto bg-border/50 mx-1" />

              <select className="h-12 bg-transparent px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 outline-none cursor-pointer transition-colors">
                <option>All Regions</option>
                <option>USA</option>
                <option>UK</option>
                <option>Canada</option>
              </select>

              <select className="h-12 bg-transparent px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 outline-none cursor-pointer transition-colors">
                <option>All Prices</option>
                <option>Low to High</option>
                <option>High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/5">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No Products Found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
