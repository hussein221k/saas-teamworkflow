import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/next";

// Re-export so it can be used in other files
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
