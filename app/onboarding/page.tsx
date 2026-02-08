"use client";

import { finishOnboarding } from "@/server/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

// If Plan enum is not available on client causing separate build, I'll hardcode strings or fetch them.
// Actually Prisma enums are available if imported.
// But valid values: FREE, PRO, ENTERPRISE.

export default function OnboardingPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        const data = {
            teamName: formData.get("teamName") as string,
            name: formData.get("name") as string,
            username: formData.get("username") as string,
            employeeCode: formData.get("employeeCode") as string,
            password: formData.get("password") as string,
            plan: formData.get("plan") as any, // Type assertion or validation
        };

        const result = await finishOnboarding(data);

        if (result.success) {
            toast.success("Setup complete!");
            // Redirect handled by server action, but we can do router.push if needed.
        } else {
             toast.error(result.error || "Setup failed");
             setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="max-w-xl w-full bg-background border rounded-2xl shadow-lg p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold">Welcome to TeamFlow</h1>
                    <p className="text-muted-foreground mt-2">Let's set up your workspace.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="teamName" className="text-sm font-bold uppercase tracking-widest opacity-70">Project / Team Name</Label>
                            <Input name="teamName" id="teamName" required placeholder="AX-NODE-01" className="bg-zinc-900 border-white/10" />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="plan" className="text-sm font-bold uppercase tracking-widest opacity-70">Resource Allocation (Plan)</Label>
                             <select name="plan" id="plan" className="flex h-10 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="FREE">Standard (Free)</option>
                                <option value="PRO">Advanced (Pro)</option>
                                <option value="ENTERPRISE">Full Spectrum (Enterprise)</option>
                             </select>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-xs text-center text-primary font-bold uppercase tracking-widest">Neural Link verified via Kinde Auth</p>
                    </div>

                    <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20" disabled={loading}>
                        {loading ? "Initializing..." : "Establish Workspace"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
