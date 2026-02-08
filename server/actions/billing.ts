"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addYears } from "date-fns";

const PlanSchema = z.enum(["FREE", "PRO", "ENTERPRISE"]);

export async function upgradePlan(teamId: number) {
  try {
    const endsAt = addYears(new Date(), 1); // Enforce yearly (1 year from now)

    const existingBilling = await prisma.billing.findUnique({
      where: { teamId },
    });

    if (existingBilling) {
      await prisma.billing.update({
        where: { teamId },
        data: { 
          plan: "PRO", 
          status: "ACTIVE",
          endsAt: endsAt,
          startedAt: new Date(),
        },
      });
    } else {
      await prisma.billing.create({
        data: {
          teamId,
          plan: "PRO",
          status: "ACTIVE",
          endsAt: endsAt,
          startedAt: new Date(),
        },
      });
    }

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to upgrade plan:", error);
    return { success: false, error: "Failed to upgrade plan" };
  }
}

export async function downgradePlan(teamId: number) {
  try {
    const existingBilling = await prisma.billing.findUnique({
      where: { teamId },
    });

    if (existingBilling) {
      await prisma.billing.update({
        where: { teamId },
        data: { 
          plan: "FREE", 
          status: "ACTIVE",
          endsAt: null, // Reset expiry for free plan
        },
      });
    } else {
       await prisma.billing.create({
        data: {
          teamId,
          plan: "FREE",
          status: "ACTIVE",
        },
      });
    }

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to downgrade plan:", error);
    return { success: false, error: "Failed to downgrade plan" };
  }
}

export async function checkSubscriptionStatus(teamId: number) {
    try {
        const billing = await prisma.billing.findUnique({
            where: { teamId },
        });

        if (billing && billing.plan !== "FREE" && billing.endsAt && new Date() > billing.endsAt) {
            // Revert to FREE
            await prisma.billing.update({
                where: { teamId },
                data: { plan: "FREE", status: "EXPIRED" }
            });
            revalidatePath("/dashboard");
            return { plan: "FREE", expired: true };
        }
        return { plan: billing?.plan || "FREE", expired: false };
    } catch (error) {
        return { plan: "FREE", expired: false };
    }
}

export async function getBillingInfo(teamId: number) {
  try {
    const billing = await prisma.billing.findUnique({
      where: { teamId },
    });
    return billing;
  } catch (error) {
    console.error("Failed to get billing info:", error);
    return null;
  }
}
