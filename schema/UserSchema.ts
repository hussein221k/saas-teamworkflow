import { z } from "zod";

// ============================================================================
// USER SCHEMA
// ============================================================================

/**
 * UserSchema
 * Validation schema for user data
 */
export const UserSchema = z.object({
  id: z.string().min(3),
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
  email: z.string().email("invalid email").nullable(),

  /**
   * Team ID - optional numeric identifier
   */
  team_id: z.string().nullable().optional(),

  /**
   * Creation date
   */
  created_at: z.date(),

  //Billing

  is_billing: z.boolean(),
  billing_type: z.enum(["FREE", "PRO", "ENTERPRISE"]).nullable(),
  billing_day: z.date().nullable().optional(),
  billing_finish: z.date().nullable().optional(),
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
  employee_code: z.string().min(1),
  /** Password - minimum 8 characters */
  password: z.string().min(8),
});

/**
 * Inferred TypeScript type from CreateEmployeeSchema
 */
export type Session = {
  id: string;
  role: string;
  name: string;
  team_id: string;
  email: string;
};
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>;
