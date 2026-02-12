import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * cn (className) Utility
 * Merges Tailwind CSS classes with proper precedence handling.
 * Combines clsx for conditional classes and twMerge for deduplication.
 *
 * @param inputs - Class values to merge
 * @returns string - Merged class name string
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
