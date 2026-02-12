"use client";

import { adminSignup } from "@/server/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Lock, Building2, ArrowRight } from "lucide-react";

type PlanType = "FREE" | "PRO" | "ENTERPRISE";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const planValue = formData.get("plan") as string;
    const validPlans: PlanType[] = ["FREE", "PRO", "ENTERPRISE"];

    // Validate and cast plan to the correct type
    const typedPlan: PlanType = validPlans.includes(planValue as PlanType)
      ? (planValue as PlanType)
      : "FREE";

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      teamName: formData.get("teamName") as string,
      plan: typedPlan,
    };

    const result = await adminSignup(data);

    if (result.success) {
      toast.success("Account created successfully!");
      router.push("/admin");
      router.refresh();
    } else {
      toast.error(result.error || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-xl w-full bg-background border rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Admin Registration</h1>
          <p className="text-muted-foreground mt-2">
            Create your admin account and team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admin Personal Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                <User className="inline h-4 w-4 mr-1" />
                Full Name
              </Label>
              <Input
                name="name"
                id="name"
                required
                minLength={3}
                placeholder="John Doe"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                <Mail className="inline h-4 w-4 mr-1" />
                Admin Email
              </Label>
              <Input
                name="email"
                id="email"
                type="email"
                required
                placeholder="admin@company.com"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                <Lock className="inline h-4 w-4 mr-1" />
                Password
              </Label>
              <Input
                name="password"
                id="password"
                type="password"
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                className="bg-background"
              />
            </div>
          </div>

          <hr className="my-4" />

          {/* Team Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-sm font-medium">
                <Building2 className="inline h-4 w-4 mr-1" />
                Team / Company Name
              </Label>
              <Input
                name="teamName"
                id="teamName"
                required
                placeholder="My Company Team"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan" className="text-sm font-medium">
                Plan
              </Label>
              <select
                name="plan"
                id="plan"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="FREE">Standard (Free)</option>
                <option value="PRO">Advanced (Pro)</option>
                <option value="ENTERPRISE">Full Spectrum (Enterprise)</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-sm font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account & Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/admin/login"
              className="text-primary hover:underline font-medium"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
