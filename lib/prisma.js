import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const db =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

/* 
    globalThis.prisma: this global variable ensures that Prisma client instance is 
    reused across hot reloads during development. without this, eachtime your application
    reloads, a new instance of the Prisma client would be created, potentially leading to 
    connection issues.
    
*/
