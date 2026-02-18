import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PricingPageClient from "./PricingPageClient";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const user = await getSession();

  // Redirect employees to dashboard - only admins can access billing
  if (!user || user.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { team: { include: { billing: true } } },
  });

  if (!dbUser) {
    return redirect("/dashboard");
  }

  const team = dbUser.team;
  const billing_type = team?.billing?.plan || "FREE";

  return (
    <PricingPageClient
      id={dbUser.id}
      name={dbUser.name}
      email={dbUser.email || ""}
      password="" // Not needed for display
      created_at={dbUser.created_at}
      is_billing={dbUser.is_billing}
      billing_type={billing_type}
      role={dbUser.role}
      team_id={dbUser.team_id || ""}
    />
  );
}
