"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeSVG from "react-qr-code";

interface QRCodeModalProps {
    address: string;
    onClose: () => void;
}

export function QRCodeModal({ address, onClose }: QRCodeModalProps) {
    // Create Bitcoin URI format
    const bitcoinURI = `bitcoin:${address}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="relative bg-background/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl ring-1 ring-white/20 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full hover:bg-muted/50 transition-colors"
                    aria-label="Close QR code"
                >
                    <X className="h-5 w-5 opacity-70" />
                </Button>

                <div className="flex flex-col items-center space-y-6">
                    <div className="text-center space-y-1">
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">Scan to Pay</h3>
                        <p className="text-sm text-muted-foreground">Use your Bitcoin wallet app</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl shadow-inner ring-4 ring-white/10">
                        <QRCodeSVG
                            value={bitcoinURI}
                            size={200}
                            level="M"
                            className="w-full h-full"
                        />
                    </div>

                    <div className="w-full space-y-3">
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-white/5">
                            <code className="flex-1 text-xs font-mono text-center text-muted-foreground break-all tracking-wide">
                                {address}
                            </code>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-center opacity-60">
                            Bitcoin Network (BTC) Only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

