import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/next";

/**
 * Arcjet Security Configuration
 * Configures rate limiting, bot detection, and shield protection for the application.
 *
 * Features:
 * - Rate limiting: 60 requests per minute per IP
 * - Bot detection: Blocks malicious bots while allowing search engines
 * - Shield protection: Guards against SQL injection, XSS, and CSRF
 */

export const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  characteristics: ["ip.src"], // Track requests by IP address
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection, XSS, CSRF
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to only log them
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Allow search engines
        "CATEGORY:PREVIEW", // Allow preview tool bots (e.g. metadata crawlers)
        "CATEGORY:MONITOR", // Allow monitoring bots
      ],
    }),
    // Create a rate limit rule
    fixedWindow({
      mode: "LIVE",
      window: "1m", // 1 minute window
      max: 60, // allow 60 requests per minute
    }),
  ],
});
