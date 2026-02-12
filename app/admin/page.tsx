import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSession } from "@/server/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/PageTransition";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  Settings,
  MessageSquare,
  Folder,
  CheckSquare,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getAdminSession();

  if (!user || !user.email) {
    return redirect("/admin/login");
  }

  // Check role
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    return (
      <div className="flex h-screen items-center justify-center text-destructive font-bold text-xl">
        Access Denied. Admins only.
      </div>
    );
  }

  // If no team, show onboarding prompt
  if (!dbUser.teamId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Setup Your Team</h1>
          <p className="text-muted-foreground mt-2">
            You need to create a team first.
          </p>
          <a
            href="/onboarding"
            className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Create Team
          </a>
        </div>
      </div>
    );
  }

  // Fetch Stats for admin's team only
  const [
    employeeCount,
    taskCount,
    channelCount,
    projectCount,
    teamMembers,
    channels,
    tasks,
    team,
  ] = await Promise.all([
    prisma.user.count({
      where: { teamId: dbUser.teamId, role: "EMPLOYEE" },
    }),
    prisma.task.count({
      where: { teamId: dbUser.teamId },
    }),
    prisma.channel.count({
      where: { teamId: dbUser.teamId },
    }),
    prisma.project.count({
      where: { teamId: dbUser.teamId },
    }),
    prisma.user.findMany({
      where: { teamId: dbUser.teamId },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.channel.findMany({
      where: { teamId: dbUser.teamId },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    }),
    prisma.task.findMany({
      where: { teamId: dbUser.teamId },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.team.findUnique({
      where: { id: dbUser.teamId },
      include: { billing: true },
    }),
  ]);

  // Get team info (already fetched above)
  // team variable is already defined in Promise.all

  return (
    <PageTransition>
      <main className="min-h-screen bg-muted p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <header>
            <h1 className="text-3xl font-bold">
              {team?.name || "My Team"} - Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your team</p>
          </header>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/admin/employees/create">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Add Employee
                  </CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+</div>
                  <p className="text-xs text-muted-foreground">
                    Create new employee account
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href={`/admin/dashboard/${dbUser.teamId}`}>
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Dashboard
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">→</div>
                  <p className="text-xs text-muted-foreground">
                    Manage your team workspace
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/settings">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Settings
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">→</div>
                  <p className="text-xs text-muted-foreground">
                    Team settings and billing
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard title="Team Members" value={employeeCount + 1} />
            <StatCard title="Total Tasks" value={taskCount} />
            <StatCard title="Channels/Groups" value={channelCount} />
            <StatCard title="Projects" value={projectCount} />
          </div>

          {/* Management Sections */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Channels/Groups Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Channels / Groups</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {channels.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {channels.map((channel) => (
                        <TableRow key={channel.id}>
                          <TableCell className="font-medium">
                            {channel.name}
                          </TableCell>
                          <TableCell>
                            {new Date(channel.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No channels yet. Go to Team Dashboard to create channels.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            {task.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.status === "DONE"
                                  ? "default"
                                  : task.status === "IN_PROGRESS"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {task.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No tasks yet. Go to Team Dashboard to create tasks.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Billing Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Billing & Plan</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    Current Plan: {team?.billing?.plan || "FREE"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {team?.billing?.status || "N/A"}
                  </p>
                </div>
                <Link href="/billing">
                  <Button variant="outline" size="sm">
                    Manage Billing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === "ADMIN" ? "default" : "secondary"}
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
