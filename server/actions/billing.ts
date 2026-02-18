"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addYears } from "date-fns";
import { plan } from "@prisma/client";

export async function upgradePlan(team_id?: string) {
  try {
    const endsAt = addYears(new Date(), 1); // Enforce yearly (1 year from now)

    // Find users with this team_id who have billing enabled
    const usersWithBilling = await prisma.user.findMany({
      where: { team_id, is_billing: true },
    });

    if (usersWithBilling.length > 0) {
      // Update billing user
      await prisma.user.update({
        where: { id: usersWithBilling[0].id },
        data: {
          billing_type: "PRO",
          billing_day: new Date(),
          billing_finish: endsAt,
        },
      });
    } else {
      // Find any team member to set as billing user
      const teamMember = await prisma.user.findFirst({
        where: { team_id },
      });

      if (teamMember) {
        await prisma.user.update({
          where: { id: teamMember.id },
          data: {
            is_billing: true,
            billing_type: "PRO",
            billing_day: new Date(),
            billing_finish: endsAt,
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

export async function downgradePlan(team_id: string) {
  try {
    // Find users with this team_id who have billing enabled
    const usersWithBilling = await prisma.user.findMany({
      where: { team_id, is_billing: true },
    });

    if (usersWithBilling.length > 0) {
      // Update billing user
      await prisma.user.update({
        where: { id: usersWithBilling[0].id },
        data: {
          billing_type: "FREE",
          billing_day: null,
          billing_finish: null,
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

export async function checkSubscriptionStatus(team_id: string) {
  try {
    // Find users with this team_id who have billing enabled
    const billingUser = await prisma.user.findFirst({
      where: { team_id, is_billing: true },
    });

    if (
      billingUser &&
      billingUser.billing_type &&
      billingUser.billing_type !== "FREE" &&
      billingUser.billing_day &&
      billingUser.billing_finish &&
      new Date() > billingUser.billing_finish
    ) {
      // Revert to FREE
      await prisma.user.update({
        where: { id: billingUser.id },
        data: {
          billing_type: "FREE",
          billing_finish: null,
        },
      });
      revalidatePath("/dashboard");
      return { plan: "FREE" as plan, expired: true };
    }
    return {
      plan: (billingUser?.billing_type || "FREE") as plan,
      expired: false,
    };
  } catch (error) {
    console.error("Failed to check subscription status:", error);
    return { plan: "FREE" as plan, expired: false };
  }
}

export async function getBillingInfo(team_id: string) {
  try {
    // Find users with this team_id who have billing enabled
    const billingUser = await prisma.user.findFirst({
      where: { team_id, is_billing: true },
    });

    if (!billingUser) {
      // Try to find any team member
      const teamMember = await prisma.user.findFirst({
        where: { team_id },
      });

      if (!teamMember) {
        return null;
      }

      return {
        team_id,
        billing_type: teamMember.billing_type || "FREE",
        billing_day: teamMember.billing_day,
        billing_finish: teamMember.billing_finish,
        is_billing: teamMember.is_billing,
      };
    }

    return {
      team_id,
      billing_type: billingUser.billing_type || "FREE",
      billing_day: billingUser.billing_day,
      billing_finish: billingUser.billing_finish,
      is_billing: billingUser.is_billing,
    };
  } catch (error) {
    console.error("Failed to get billing info:", error);
    return null;
  }
}
