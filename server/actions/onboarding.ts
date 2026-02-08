"use server";

import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Plan, Role, BillingStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { secureAction } from "@/lib/security";

const OnboardingSchema = z.object({
    teamName: z.string().min(2, "Team name is required"),
    plan: z.nativeEnum(Plan),
});

export async function finishOnboarding(formData: z.infer<typeof OnboardingSchema>) {
    const security = await secureAction();
    if (security.denied) return { success: false, error: security.error };

    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser || !kindeUser.email) {
        return { success: false, error: "Unauthorized" };
    }

    const parse = OnboardingSchema.safeParse(formData);
    if (!parse.success) {
        return { success: false, error: parse.error.issues[0].message };
    }

    const { teamName, plan } = parse.data;

    const existing = await prisma.user.findUnique({
        where: { email: kindeUser.email! }
    });

    if (existing && existing.teamId) {
        return { success: false, error: "Account already set up" };
    }

    try {
        await prisma.$transaction(async (tx: any) => {
            // 1. Create or Update User
            let user;
            if (existing) {
                user = await tx.user.update({
                    where: { id: existing.id },
                    data: { role: Role.ADMIN }
                });
            } else {
                user = await tx.user.create({
                    data: {
                        name: `${kindeUser.given_name || ""} ${kindeUser.family_name || ""}`.trim() || "Unit-01",
                        email: kindeUser.email!,
                        role: Role.ADMIN,
                        password: "", // Not used for Kinde users during onboarding
                    }
                });
            }

            // 1. Create or Update User already done.
            
            // 2. Create Team
            const newTeam = await tx.team.create({
                data: {
                    name: teamName,
                    ownerId: user.id,
                }
            });

            // 3. Update User with Team ID
            await tx.user.update({
                where: { id: user.id },
                data: { teamId: newTeam.id }
            });
            
            // 4. Create Billing
            await tx.billing.create({
                data: {
                    teamId: newTeam.id,
                    plan: plan,
                    status: BillingStatus.ACTIVE
                }
            });
        });
        
        // Cannot redirect inside transaction or try/catch easily if looking for return value
        // But server actions redirection throws error (NEXT_REDIRECT).
        // So redirection must be outside catch or re-thrown.
    } catch (e: any) {
        console.error("Onboarding failed:", e);
        return { success: false, error: "Setup failed. Please try again." };
    }

    redirect("/dashboard");
}
