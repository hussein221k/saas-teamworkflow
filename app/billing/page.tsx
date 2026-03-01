// =============================================================================
// FEATURE: Billing / Pricing — Planned upgrade. Full implementation is in
// PricingPageClient.tsx and server/actions/billing.ts. Restore this route
// and nav links when enabling billing. Until then, this page is hidden from
// nav and shows a placeholder so the route does not 404.
// =============================================================================

import Link from "next/link";

export default function BillingPlaceholderPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-100">
          Billing &amp; Pricing
        </h1>
        <p className="text-zinc-400 text-sm">
          This feature is planned for a future upgrade. Subscription and plan
          management will be available here.
        </p>
        <Link
          href="/"
          className="inline-block text-sm text-primary hover:underline"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
