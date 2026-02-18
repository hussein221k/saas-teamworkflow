import { getAdminSession } from "@/server/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const user = await getAdminSession();

  if (!user || user.role !== "ADMIN") {
    return redirect("/admin/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { team: true },
  });

  if (!dbUser || !dbUser.team_id) {
    return redirect("/onboarding");
  }

  return redirect(`/admin/dashboard/${dbUser.team_id}`);
}
