/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
        return { valid: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return { valid: false, error: "Invalid email address format" };
    }

    return { valid: true };
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): ValidationResult {
    if (!password || password.length === 0) {
        return { valid: false, error: "Password is required" };
    }

    if (password.length < 8) {
        return { valid: false, error: "Password must be at least 8 characters long" };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: "Password must contain at least one uppercase letter" };
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, error: "Password must contain at least one lowercase letter" };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, error: "Password must contain at least one number" };
    }

    return { valid: true };
}

/**
 * Validates username format
 */
export function validateUsername(username: string): ValidationResult {
    if (!username || username.trim().length === 0) {
        return { valid: false, error: "Username is required" };
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
        return { valid: false, error: "Username must be at least 3 characters long" };
    }

    if (trimmedUsername.length > 20) {
        return { valid: false, error: "Username must be less than 20 characters" };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
        return { valid: false, error: "Username can only contain letters, numbers, and underscores" };
    }

    return { valid: true };
}

/**
 * Validates captcha answer
 */
export function validateCaptcha(answer: string, expected: number): ValidationResult {
    if (!answer || answer.trim().length === 0) {
        return { valid: false, error: "Captcha answer is required" };
    }

    const parsedAnswer = parseInt(answer.trim(), 10);

    if (isNaN(parsedAnswer)) {
        return { valid: false, error: "Captcha answer must be a number" };
    }

    if (parsedAnswer !== expected) {
        return { valid: false, error: "Incorrect captcha answer" };
    }

    return { valid: true };
}

/**
 * Sanitizes string input
 */
export function sanitizeInput(input: string): string {
    return input.trim();
}

/**
 * Sanitizes email input (lowercase + trim)
 */
export function sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

