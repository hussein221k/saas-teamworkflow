import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/ui/ModeToggle"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "./_components/ProfileForm";

export default async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return redirect("/api/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    return <div>User not found.</div>;
  }

  return (
    <main className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm 
              initialName={dbUser.name} 
              initialEmail={dbUser.email!} 
            />
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark modes
                </p>
              </div>
              <ModeToggle />
            </div>

            <Separator />

            {/* Language - Keeping it static for now as requested by user logic is mostly about visuals */}
            <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
               <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">English (Default)</p>
               </div>
            </div>

          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be certain.
             </p>
             <button disabled className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 rounded pointer-events-none opacity-50">
               Delete Account (Contact Support)
             </button>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}

