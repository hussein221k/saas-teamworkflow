import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PricingPageClient from "./PricingPageClient";

export default async function PricingPage() {
  const user = await getSession();

  const dbUser = await prisma.user.findUnique({
    where: user?.email ? { email: user.email } : { id: -1 },
    include: { team: { include: { billing: true } } },
  });

  const team = dbUser?.team;
  const isOwner = team?.ownerId === dbUser?.id;
  const currentPlan = team?.billing?.plan || "NONE";

  return (
    <PricingPageClient
      dbUser={dbUser}
      team={team}
      isOwner={isOwner}
      currentPlan={currentPlan}
    />
  );
}
