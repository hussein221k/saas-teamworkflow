import { getSession } from "@/server/actions/employee-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getSession();

  if (!user || !user.email) {
    return redirect("/employee/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { team: true },
  });

  if (!dbUser || !dbUser.team_id) {
    return redirect("/onboarding");
  }

  return redirect(`/dashboard/${dbUser.team_id}`);
}
