import { ZodSchema } from "zod";

/**
 * Run a zod schema against an arbitrary payload.
 * If validation fails the ZodError is thrown so the caller can
 * decide how to handle it (usually returning a failure response).
 */
export function validateRequest<T>(schema: ZodSchema<T>, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw parsed.error;
  }
  return parsed.data;
}
