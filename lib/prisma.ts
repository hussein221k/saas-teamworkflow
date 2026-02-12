import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

const connectionString = process.env.DATABASE_URL;

// Create a PostgreSQL connection pool
const pool = new Pool({ connectionString });
// Create Prisma adapter using the pool
const adapter = new PrismaPg(pool);

/**
 * Prisma Client Singleton Factory
 * Creates a new PrismaClient instance with proper configuration.
 * Uses singleton pattern to prevent multiple connections in development.
 *
 * @returns PrismaClient - Configured Prisma client instance
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Global reference to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Use existing client or create new one
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export { prisma };

// Hot reload support - keep same client in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
