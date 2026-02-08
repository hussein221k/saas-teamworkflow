import { headers } from "next/headers";
import { aj } from "./arcjet";

/**
 * Secure Action Wrapper
 * Standardizes security checks across server actions and resolves Arcjet type conflicts.
 */
export async function secureAction() {
    const decision = await aj.protect((await headers()) as any);
    
    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return { denied: true, error: "Too many attempts. Resource lock engaged.", decision };
        }
        if (decision.reason.isBot()) {
            return { denied: true, error: "Bot activity detected. Connection terminated.", decision };
        }
        return { denied: true, error: "Security protocol violation. Access denied.", decision };
    }

    return { denied: false, decision };
}
