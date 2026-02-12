import { z } from "zod";

// ============================================================================
// USER SCHEMA
// ============================================================================

/**
 * UserSchema
 * Validation schema for user data
 */
export const UserSchema = z.object({
  /**
   * User name - between 3 and 20 characters
   */
  name: z.string().min(3).max(20),

  /**
   * User role - optional, either ADMIN or EMPLOYEE
   */
  role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),

  /**
   * Password - minimum 8 characters
   */
  password: z.string().min(8),

  /**
   * Email - valid email format
   */
  email: z.string().email("invalid email"),

  /**
   * Team ID - optional numeric identifier
   */
  teamId: z.number().int().optional(),

  /**
   * Creation date
   */
  createAt: z.date(),

  //Billing

  isBilling: z.boolean(),
  billingType: z.enum(["FREE" , "PRO" , "ENTERPRISE"]),
  billingDay: z.date().optional(),
  billingFinish: z.date().optional()
});

/**
 * Inferred TypeScript type from UserSchema
 */
export type User = z.infer<typeof UserSchema>;

// ============================================================================
// CREATE EMPLOYEE SCHEMA
// ============================================================================

/**
 * CreateEmployeeSchema
 * Validation schema for creating a new employee
 */
export const CreateEmployeeSchema = z.object({
  /** Employee display name */
  name: z.string().min(3).max(20),
  /** Unique username */
  username: z.string().min(3).max(30),
  /** Unique employee code */
  employeeCode: z.string().min(1),
  /** Password - minimum 8 characters */
  password: z.string().min(8),
});

/**
 * Inferred TypeScript type from CreateEmployeeSchema
 */
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>;
