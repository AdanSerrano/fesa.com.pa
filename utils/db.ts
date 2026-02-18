import { PrismaClient } from "@/app/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  adapter: PrismaMariaDb | undefined;
};

function createPrismaClient(): PrismaClient {
  const adapter = globalForPrisma.adapter ?? new PrismaMariaDb(process.env.DATABASE_URL as string);

  if (!globalForPrisma.adapter) {
    globalForPrisma.adapter = adapter;
  }

  return new PrismaClient({
    adapter,
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = db;