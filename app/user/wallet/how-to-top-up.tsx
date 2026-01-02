"use client";

import { Copy, Send, CheckCircle } from "lucide-react";

export function HowToTopUp() {
    const steps = [
        {
            number: 1,
            icon: Copy,
            title: "Copy your unique generated Bitcoin address",
            description: "Use the copy button to copy your unique Bitcoin address.",
        },
        {
            number: 2,
            icon: Send,
            title: "Send Bitcoin from your Binance or any platform to this address",
            description: "Transfer Bitcoin from your wallet or exchange to the address you copied.",
        },
        {
            number: 3,
            icon: CheckCircle,
            title: "Balance updates automatically",
            description: "Your account balance will be credited once the transaction is confirmed on the blockchain (typically 1-6 confirmations).",
        },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">How to Top Up</h3>

            <div className="space-y-4">
                {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={step.number}
                            className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border"
                        >
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary border-2 border-primary">
                                    <span className="text-sm font-bold">{step.number}</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-primary" />
                                    <h4 className="font-semibold text-foreground">{step.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-400">
                    <strong>Note:</strong> Bitcoin transactions typically require 1-6 confirmations on the blockchain before your balance is updated. This usually takes 10-60 minutes.
                </p>
            </div>
        </div>
    );
}

