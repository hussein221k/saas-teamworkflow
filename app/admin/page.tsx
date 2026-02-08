import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/PageTransition";

export default async function AdminDashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return redirect("/api/auth/login");
  }

  // Check role
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser || dbUser.role !== 'ADMIN') {
    return (
        <div className="flex h-screen items-center justify-center text-destructive font-bold text-xl">
            Access Denied. Admins only.
        </div>
    );
  }

  // Fetch Stats
  const [userCount, teamCount, taskCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.task.count(),
    prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { team: true }
    })
  ]);

  return (
    <PageTransition>
      <main className="min-h-screen bg-muted p-6">
        <div className="mx-auto max-w-6xl space-y-8">
            
            <header>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your SaaS platform</p>
            </header>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard title="Total Users" value={userCount} />
                <StatCard title="Total Teams" value={teamCount} />
                <StatCard title="Total Tasks" value={taskCount} />
            </div>

            {/* Recent Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentUsers.map(u => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                      <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                                        {u.role}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{u.team?.name || 'No Team'}</TableCell>
                                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
      </main>
    </PageTransition>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}
