import { headers } from "next/headers";
import { aj } from "./arcjet";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Headers type for Arcjet protection
 */
type ArcjetHeaders = Record<string, string>;

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

/**
 * Secure Action Wrapper
 * Standardizes security checks across server actions and resolves Arcjet type conflicts.
 * Validates requests against rate limiting and bot detection rules.
 *
 * @returns Object with denied status and error message if blocked
 * @property denied - boolean indicating if the request was blocked
 * @property error - string error message if denied
 * @property decision - Arcjet decision object for detailed information
 */
export async function secureAction() {
  const headersList = await headers();
  const headersObj: ArcjetHeaders = {};
  headersList.forEach((value, key) => {
    headersObj[key] = value;
  });

  const decision = await aj.protect(headersObj);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return {
        denied: true,
        error: "Too many attempts. Resource lock engaged.",
        decision,
      };
    }
    if (decision.reason.isBot()) {
      return {
        denied: true,
        error: "Bot activity detected. Connection terminated.",
        decision,
      };
    }
    return {
      denied: true,
      error: "Security protocol violation. Access denied.",
      decision,
    };
  }

  return { denied: false, decision };
}
