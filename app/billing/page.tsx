import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import PricingPageClient from "./PricingPageClient";

export default async function PricingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  let dbUser: any = null;
  if (user?.email) {
    dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { team: { include: { billing: true } } },
    });
  }

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
