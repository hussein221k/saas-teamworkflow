/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/server/actions/admin-auth";
import { Role } from "@prisma/client";
import { CreateEmployeeSchema, CreateEmployee } from "@/schema/UserSchema";
import { revalidatePath } from "next/cache";

export async function createEmployee(data: CreateEmployee) {
  const sessionUser = await getAdminSession();

  if (!sessionUser || !sessionUser.email) {
    return { success: false, error: "Unauthorized. Please login as admin." };
  }

  // Verify Admin
  const adminUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
  });

  if (!adminUser || adminUser.role !== Role.ADMIN) {
    return { success: false, error: "Only admins can create employees." };
  }

  // Check if admin has a team
  if (!adminUser.teamId) {
    return { success: false, error: "Admin must have a team first." };
  }

  const parse = CreateEmployeeSchema.safeParse(data);
  if (!parse.success) {
    return { success: false, error: parse.error.issues[0].message };
  }

  const { name, username, employeeCode, password } = parse.data;

  // Check unique constraints
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { employeeCode }],
    },
  });

  if (existing) {
    return {
      success: false,
      error: "Username or Employee Code already exists.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        username,
        employeeCode,
        password: hashedPassword,
        role: Role.EMPLOYEE,
        teamId: adminUser.teamId, // Assign to Admin's team by default
        createdById: adminUser.id,
        isBilling: false,
        billingDay: null,
        billingFinish: null,

        // email is optional now
      },
    });
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    console.error("Failed to create employee:", error);
    return { success: false, error: "Failed to create employee" };
  }
}

export async function deleteEmployee(employeeId: number) {
  const sessionUser = await getAdminSession();

  if (!sessionUser || !sessionUser.email) {
    return { success: false, error: "Unauthorized. Please login as admin." };
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
  });

  if (!adminUser || adminUser.role !== Role.ADMIN) {
    return { success: false, error: "System access denied." };
  }

  // Check if admin has a team
  if (!adminUser.teamId) {
    return { success: false, error: "Admin must have a team first." };
  }

  try {
    await prisma.user.deleteMany({
      where: {
        id: employeeId,
        teamId: adminUser.teamId,
        role: Role.EMPLOYEE,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Decommissioning operation aborted." };
  }
}
