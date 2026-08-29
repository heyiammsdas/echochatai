import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const db = globalThis.prisma || new PrismaClient({
  adapter,
  log: ["error", "info", "query", "warn"],
});

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = db;
}

export default db;