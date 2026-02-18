import { getAdminSession } from "@/server/actions/admin-auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    return Response.json({ session: session ?? null }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error }, { status: 404 });
  }
}
