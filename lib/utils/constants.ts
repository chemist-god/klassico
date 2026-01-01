/**
 * Application constants
 */

// Session configuration
export const SESSION_CONFIG = {
  COOKIE_NAME: "kubera_session",
  MAX_AGE: 60 * 60 * 24 * 7, // 7 days
} as const;

// Route configurations
export const ROUTES = {
  PROTECTED: ["/user", "/shop"],
  AUTH: ["/login", "/register"],
  DASHBOARD: "/user/dashboard",
  LOGIN: "/login",
} as const;

