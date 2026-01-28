/**
 * Cart Timer Utilities
 * 
 * Manages per-item countdown timers for cart items.
 * Each cart item gets its own 10-minute timer that persists across page refreshes.
 */

import { genVariable } from "@/lib/config/genVariable";

const TIMER_DURATION_MINUTES = genVariable.timeouts.cartTimerMinutes;
const TIMER_STORAGE_PREFIX = genVariable.storage.cartTimerPrefix;

/**
 * Get the timer start time for a specific cart item
 * @param cartItemId - The cart item ID
 * @returns Start timestamp in milliseconds, or null if not found
 */
export function getCartItemTimer(cartItemId: string): number | null {
    if (typeof window === "undefined") return null;

    try {
        const stored = localStorage.getItem(`${TIMER_STORAGE_PREFIX}${cartItemId}`);
        if (stored) {
            return parseInt(stored, 10);
        }
        return null;
    } catch (error) {
        console.error("Error getting cart item timer:", error);
        return null;
    }
}

/**
 * Set the timer start time for a specific cart item
 * @param cartItemId - The cart item ID
 * @param startTime - Start timestamp in milliseconds (defaults to now)
 */
export function setCartItemTimer(
    cartItemId: string,
    startTime?: number
): void {
    if (typeof window === "undefined") return;

    try {
        const timestamp = startTime || Date.now();
        localStorage.setItem(
            `${TIMER_STORAGE_PREFIX}${cartItemId}`,
            timestamp.toString()
        );
    } catch (error) {
        console.error("Error setting cart item timer:", error);
    }
}

/**
 * Clear the timer for a specific cart item
 * @param cartItemId - The cart item ID
 */
export function clearCartItemTimer(cartItemId: string): void {
    if (typeof window === "undefined") return;

    try {
        localStorage.removeItem(`${TIMER_STORAGE_PREFIX}${cartItemId}`);
    } catch (error) {
        console.error("Error clearing cart item timer:", error);
    }
}

/**
 * Clear all cart item timers
 */
export function clearAllCartTimers(): void {
    if (typeof window === "undefined") return;

    try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
            if (key.startsWith(TIMER_STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.error("Error clearing all cart timers:", error);
    }
}

/**
 * Get timer duration in minutes
 */
export function getTimerDuration(): number {
    return TIMER_DURATION_MINUTES;
}

