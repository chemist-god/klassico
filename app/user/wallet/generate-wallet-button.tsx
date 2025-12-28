"use client";

import { Button } from "@/components/ui/button";
import { generateWalletAddress } from "@/lib/actions/wallet";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateWalletButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleGenerate() {
        setIsLoading(true);
        try {
            const result = await generateWalletAddress();
            if (result.success) {
                router.refresh();
            } else {
                console.error("Failed to generate wallet:", result.error);
            }
        } catch (error) {
            console.error("Error generating wallet:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white rounded-full font-semibold shadow transition-transform duration-150 active:scale-95"
        >
            {isLoading ? "Generating..." : "Generate Wallet Address"}
        </Button>
    );
}

