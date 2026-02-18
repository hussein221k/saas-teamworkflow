import { getAdminSession } from "@/server/actions/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminRootPage() {
  const user = await getAdminSession();

  if (user && user.role === "ADMIN") {
    return redirect("/admin/dashboard");
  }

  return redirect("/admin/login");
}
