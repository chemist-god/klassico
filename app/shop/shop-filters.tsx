"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce"; // We might need to create this hook if it doesn't exist, or just use setTimeout
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export function ShopFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [region, setRegion] = useState(searchParams.get("region") || "all");
    const [price, setPrice] = useState(searchParams.get("price") || "all");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            updateFilters({ q: search });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    // Update URL function
    const updateFilters = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "" || value === "all") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });

            router.push(`/shop?${params.toString()}`, { scroll: false });
        },
        [router, searchParams]
    );

    // Handlers
    const handleRegionChange = (val: string) => {
        setRegion(val);
        updateFilters({ region: val });
    };

    const handlePriceChange = (val: string) => {
        setPrice(val);
        updateFilters({ price: val });
    };

    const clearFilters = () => {
        setSearch("");
        setRegion("all");
        setPrice("all");
        router.push("/shop");
    };

    const activeFilterCount = [
        searchParams.get("q"),
        searchParams.get("region"),
        searchParams.get("price"),
    ].filter(Boolean).length;

    return (
        <div className="w-full">
            <div className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-sm rounded-2xl p-3 flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10 h-10 bg-muted/40 border-border/50 focus-visible:bg-background transition-colors"
                        placeholder="Search products, bins, or banks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Filters Group */}
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 px-1 md:px-0 no-scrollbar items-center">
                    <Select value={region} onValueChange={handleRegionChange}>
                        <SelectTrigger className="w-[140px] h-10 bg-muted/40 border-border/50">
                            <SelectValue placeholder="Region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Regions</SelectItem>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="UK">UK</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="EU">Europe</SelectItem>
                            <SelectItem value="Asia">Asia</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={price} onValueChange={handlePriceChange}>
                        <SelectTrigger className="w-[140px] h-10 bg-muted/40 border-border/50">
                            <SelectValue placeholder="Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="asc">Low to High</SelectItem>
                            <SelectItem value="desc">High to Low</SelectItem>
                        </SelectContent>
                    </Select>

                    <Sheet open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="h-10 px-4 gap-2 bg-muted/40 border-border/50 hover:bg-muted/60 relative">
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="hidden sm:inline">Advanced</span>
                                {activeFilterCount > 0 && (
                                    <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] border-2 border-background">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Advanced Filters</SheetTitle>
                                <SheetDescription>
                                    Refine your search with specific parameters.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="py-6 space-y-6">
                                {/* Advanced Filter Placeholders */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Bank Type</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Chase', 'BOA', 'Wells', 'Citi'].map(bank => (
                                            <div key={bank} className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                                                <div className="h-4 w-4 rounded border border-primary/20" />
                                                <span className="text-sm">{bank}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Balance Range</h4>
                                    <div className="flex items-center gap-2">
                                        <Input placeholder="Min" type="number" className="h-9" />
                                        <span className="text-muted-foreground">-</span>
                                        <Input placeholder="Max" type="number" className="h-9" />
                                    </div>
                                </div>

                                <Button className="w-full" onClick={() => setIsAdvancedOpen(false)}>
                                    Apply Filters
                                </Button>

                                <Button variant="ghost" className="w-full text-muted-foreground" onClick={clearFilters}>
                                    Reset All Filters
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {activeFilterCount > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                    <span>Active filters:</span>
                    {search && <Badge variant="secondary" className="px-2 py-0.5 text-xs">Search: {search}</Badge>}
                    {region !== "all" && <Badge variant="secondary" className="px-2 py-0.5 text-xs">Region: {region}</Badge>}
                    {price !== "all" && <Badge variant="secondary" className="px-2 py-0.5 text-xs">Price: {price}</Badge>}
                    <button onClick={clearFilters} className="text-xs hover:text-primary transition-colors ml-2 underline decoration-dashed">
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}
