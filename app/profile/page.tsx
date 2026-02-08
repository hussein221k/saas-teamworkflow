import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return redirect("/api/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      team: true,
      _count: {
        select: {
          tasksCreated: true,
          tasksAssigned: true,
          comments: true,
        },
      },
    },
  });

  if (!dbUser) {
    return <div>User not found.</div>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          
          <Avatar className="mx-auto h-28 w-28">
            <AvatarImage src={user.picture || ""} alt={user.given_name || "User"} />
            <AvatarFallback>{(user.given_name?.[0] || dbUser.name?.[0] || "U").toUpperCase()}</AvatarFallback>
          </Avatar>

          <h2 className="mt-4 text-xl font-semibold">{dbUser.name}</h2>
          <p className="text-sm text-muted-foreground">{dbUser.email}</p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{dbUser.role}</p>

          <div className="mt-3 flex justify-center gap-2">
            <Badge variant="secondary">{dbUser.team?.name || "No Team"}</Badge>
            <Badge variant="outline">Member since {new Date(dbUser.createdAt).toLocaleDateString()}</Badge>
          </div>

          <div className="mt-6 flex justify-around border-t pt-4">
            <Stat label="Tasks Created" value={dbUser._count.tasksCreated.toString()} />
            <Stat label="Tasks Assigned" value={dbUser._count.tasksAssigned.toString()} />
            <Stat label="Comments" value={dbUser._count.comments.toString()} />
          </div>

        </CardContent>
      </Card>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold">{value}</p>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
