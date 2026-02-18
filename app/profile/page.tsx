import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getSession();

  if (!user || !user.email) {
    return redirect("/employee/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      team: true,
      _count: {
        select: {
          tasks_created: true,
          tasks_assigned: true,
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
            <AvatarFallback>
              {(dbUser.name?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h2 className="mt-4 text-xl font-semibold">{dbUser.name}</h2>
          <p className="text-sm text-muted-foreground">{dbUser.email}</p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
            {dbUser.role}
          </p>

          <div className="mt-3 flex justify-center gap-2">
            <Badge variant="secondary">{dbUser.team?.name || "No Team"}</Badge>
            <Badge variant="outline">
              Member since {new Date(dbUser.created_at).toLocaleDateString()}
            </Badge>
          </div>

          <div className="mt-6 flex justify-around border-t pt-4">
            <Stat
              label="Tasks Created"
              value={dbUser._count.tasks_created.toString()}
            />
            <Stat
              label="Tasks Assigned"
              value={dbUser._count.tasks_assigned.toString()}
            />
            <Stat label="Comments" value={dbUser._count.comments.toString()} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold">{value}</p>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
