export const dynamic = "force-dynamic";

import { getProducts } from "@/lib/actions/products";
import { Product } from "@/lib/api/types";
import { ProductCard } from "./product-card";
import { ShopFilters } from "./shop-filters";
import * as motion from "framer-motion/client";
import { Search } from "lucide-react";

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const result = await getProducts();
  const allProducts: Product[] = result.success && result.data ? result.data : [];

  // ----------------------------------------------------------------------
  // Server-Side Filtering Logic
  // In a real enterprise app, this would happen in the DB query (Prisma).
  // For now, we filter the array since the dataset is small.
  // ----------------------------------------------------------------------

  const query = (params.q as string)?.toLowerCase() || "";
  const regionParam = (params.region as string) || "all";
  const priceParam = (params.price as string) || "all";

  // Advanced Params
  const banksParam = (params.banks as string) || "";
  const minBalParam = parseFloat(params.min as string) || 0;
  const maxBalParam = parseFloat(params.max as string) || Infinity;

  let products = allProducts.filter((product) => {
    // Search Filter
    const matchesSearch = query
      ? product.name.toLowerCase().includes(query) ||
      product.bank.toLowerCase().includes(query) ||
      product.region.toLowerCase().includes(query)
      : true;

    // Region Filter
    const matchesRegion = regionParam !== "all"
      ? product.region.toLowerCase() === regionParam.toLowerCase()
      : true;

    // Bank Filter
    const matchesBank = banksParam
      ? banksParam.split(",").some(b => product.bank.toLowerCase().includes(b.toLowerCase()))
      : true;

    // Balance Range Filter
    const matchesBalance = product.balance >= minBalParam &&
      (maxBalParam === Infinity ? true : product.balance <= maxBalParam);

    return matchesSearch && matchesRegion && matchesBank && matchesBalance;
  });

  // Price Sort
  if (priceParam === "asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (priceParam === "desc") {
    products.sort((a, b) => b.price - a.price);
  }

  // ----------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
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
              <span className="font-medium text-foreground">{allProducts.length}</span> Products Live
            </div>
          </div>
        </motion.div>

        {/* Client-Side Filter Bar (Maintains State) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sticky top-4 z-30"
        >
          <ShopFilters />
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
                {"We couldn't find any products matching your filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
