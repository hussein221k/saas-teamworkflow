"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addYears } from "date-fns";
import { Plan } from "@prisma/client";

export async function upgradePlan(teamId: number) {
  try {
    const endsAt = addYears(new Date(), 1); // Enforce yearly (1 year from now)

    // Find users with this teamId who have billing enabled
    const usersWithBilling = await prisma.user.findMany({
      where: { teamId, isBilling: true },
    });

    if (usersWithBilling.length > 0) {
      // Update billing user
      await prisma.user.update({
        where: { id: usersWithBilling[0].id },
        data: {
          billingType: "PRO",
          billingDay: new Date(),
          billingFinish: endsAt,
        },
      });
    } else {
      // Find any team member to set as billing user
      const teamMember = await prisma.user.findFirst({
        where: { teamId },
      });

      if (teamMember) {
        await prisma.user.update({
          where: { id: teamMember.id },
          data: {
            isBilling: true,
            billingType: "PRO",
            billingDay: new Date(),
            billingFinish: endsAt,
          },
        });
      }
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
    // Find users with this teamId who have billing enabled
    const usersWithBilling = await prisma.user.findMany({
      where: { teamId, isBilling: true },
    });

    if (usersWithBilling.length > 0) {
      // Update billing user
      await prisma.user.update({
        where: { id: usersWithBilling[0].id },
        data: {
          billingType: "FREE",
          billingDay: null,
          billingFinish: null,
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
    // Find users with this teamId who have billing enabled
    const billingUser = await prisma.user.findFirst({
      where: { teamId, isBilling: true },
    });

    if (
      billingUser &&
      billingUser.billingType &&
      billingUser.billingType !== "FREE" &&
      billingUser.billingDay &&
      billingUser.billingFinish &&
      new Date() > billingUser.billingFinish
    ) {
      // Revert to FREE
      await prisma.user.update({
        where: { id: billingUser.id },
        data: {
          billingType: "FREE",
          billingFinish: null,
        },
      });
      revalidatePath("/dashboard");
      return { plan: "FREE" as Plan, expired: true };
    }
    return {
      plan: (billingUser?.billingType || "FREE") as Plan,
      expired: false,
    };
  } catch (error) {
    console.error("Failed to check subscription status:", error);
    return { plan: "FREE" as Plan, expired: false };
  }
}

export async function getBillingInfo(teamId: number) {
  try {
    // Find users with this teamId who have billing enabled
    const billingUser = await prisma.user.findFirst({
      where: { teamId, isBilling: true },
    });

    if (!billingUser) {
      // Try to find any team member
      const teamMember = await prisma.user.findFirst({
        where: { teamId },
      });

      if (!teamMember) {
        return null;
      }

      return {
        teamId,
        billingType: teamMember.billingType || "FREE",
        billingDay: teamMember.billingDay,
        billingFinish: teamMember.billingFinish,
        isBilling: teamMember.isBilling,
      };
    }

    return {
      teamId,
      billingType: billingUser.billingType || "FREE",
      billingDay: billingUser.billingDay,
      billingFinish: billingUser.billingFinish,
      isBilling: billingUser.isBilling,
    };
  } catch (error) {
    console.error("Failed to get billing info:", error);
    return null;
  }
}
