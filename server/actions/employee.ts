/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/server/actions/admin-auth";
import { role } from "@prisma/client";
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

  if (!adminUser || adminUser.role !== role.ADMIN) {
    return { success: false, error: "Only admins can create employees." };
  }

  // Check if admin has a team
  if (!adminUser.team_id) {
    return { success: false, error: "Admin must have a team first." };
  }

  const parse = CreateEmployeeSchema.safeParse(data);
  if (!parse.success) {
    return { success: false, error: parse.error.issues[0].message };
  }

  const { name, username, employee_code, password } = parse.data;

  // Check unique constraints
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { employee_code }],
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
        employee_code,
        password: hashedPassword,
        role: role.EMPLOYEE,
        team_id: adminUser.team_id, // Assign to Admin's team by default
        created_by_id: adminUser.id,
        is_billing: false,
        billing_day: null,
        billing_finish: null,

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

export async function deleteEmployee(employeeId: string) {
  const sessionUser = await getAdminSession();

  if (!sessionUser || !sessionUser.email) {
    return { success: false, error: "Unauthorized. Please login as admin." };
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
  });

  if (!adminUser || adminUser.role !== role.ADMIN) {
    return { success: false, error: "System access denied." };
  }

  // Check if admin has a team
  if (!adminUser.team_id) {
    return { success: false, error: "Admin must have a team first." };
  }

  try {
    await prisma.user.deleteMany({
      where: {
        id: employeeId,
        team_id: adminUser.team_id,
        role: role.EMPLOYEE,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Decommissioning operation aborted." };
  }
}
