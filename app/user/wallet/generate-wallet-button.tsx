"use client";

import { ActionButton } from "@/components/common/action-button";
import { generateWalletAddress } from "@/lib/actions/wallet";

export function GenerateWalletButton() {
    return (
        <ActionButton
            action={async () => await generateWalletAddress()}
            loadingText="Generating..."
            refreshOnSuccess={true}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white rounded-full font-semibold shadow transition-transform duration-150 active:scale-95"
        >
            Generate Wallet Address
        </ActionButton>
    );
}

