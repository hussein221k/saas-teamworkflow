"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const EmployeeSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3),
  employeeCode: z.string().min(5),
  password: z.string().min(6),
});

export type EmployeeInput = z.infer<typeof EmployeeSchema>;

export async function createEmployee(data: EmployeeInput) {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();

  if (!sessionUser || !sessionUser.email) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify Admin
  // Note: Only ADMINs can create employees?
  const adminUser = await prisma.user.findUnique({
      where: { email: sessionUser.email }
  });

  if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "Only admins can create employees." };
  }

  const parse = EmployeeSchema.safeParse(data);
  if (!parse.success) {
    return { success: false, error: parse.error.issues[0].message };
  }

  const { name, username, employeeCode, password } = parse.data;

  // Check unique constraints
  const existing = await prisma.user.findFirst({
      where: {
          OR: [
              { username },
              { employeeCode }
          ]
      }
  });

  if (existing) {
      return { success: false, error: "Username or Employee Code already exists." };
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
              createdById: adminUser.id
              // email is optional now
          }
      });
      revalidatePath("/admin/employees");
      return { success: true };
  } catch (error) {
      console.error("Failed to create employee:", error);
      return { success: false, error: "Failed to create employee" };
  }
}

export async function deleteEmployee(employeeId: number) {
    const { getUser } = getKindeServerSession();
    const sessionUser = await getUser();
  
    if (!sessionUser || !sessionUser.email) {
      return { success: false, error: "Unauthorized" };
    }
  
    const adminUser = await (prisma as any).user.findUnique({
      where: { email: sessionUser.email }
    });
  
    if (!adminUser || adminUser.role !== Role.ADMIN) {
      return { success: false, error: "System access denied." };
    }
  
    try {
      await (prisma as any).user.deleteMany({
        where: {
          id: employeeId,
          teamId: adminUser.teamId,
          role: Role.EMPLOYEE
        }
      });
  
      revalidatePath("/dashboard");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Decommissioning operation aborted." };
    }
}
