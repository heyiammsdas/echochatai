import { PrismaClient } from "@/generated/prisma/client";

const db = globalThis.prisma || new PrismaClient({ });

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = db;
}

export default db;