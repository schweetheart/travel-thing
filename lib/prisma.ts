import { cache } from "react"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
export default prisma

export const getDb = cache(() => {
  const connectionString = process.env.DATABASE_URL ?? ""
  const adapter = new PrismaPg({ connectionString, maxUses: 1 })
  const prisma = new PrismaClient({ adapter })
  return prisma
})
