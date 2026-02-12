"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { upgradePlan } from "@/server/actions/billing";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner or use standard toast if available

export default function BillingActions({ teamId, currentPlan }: { teamId: number; currentPlan: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const result = await upgradePlan(teamId);
    setLoading(false);
    if (result.success) {
      toast.success("Upgraded to Pro!");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

 /* const handleDowngrade = async () => {
    setLoading(true);
    const result = await downgradePlan(teamId);
    setLoading(false);
    if (result.success) {
      toast.success("Downgraded to Free.");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }; */

  return (
    <>
      {currentPlan !== "PRO" && (
        <Button className="w-full" onClick={handleUpgrade} disabled={loading}>
          {loading ? "Upgrading..." : "Upgrade to Pro"}
        </Button>
      )}
      {currentPlan === "PRO" && (
        <Button className="w-full" variant="outline" disabled>
          Current Plan
        </Button>
      )}
    </>
  );
}
