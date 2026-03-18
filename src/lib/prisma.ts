// Prisma client - only used in server-side API routes with a real database
// In demo mode, data comes from src/lib/demo-data.ts

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  (process.env.DATABASE_URL
    ? new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"] })
    : null);

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
