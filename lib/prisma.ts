import { cache } from "react"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

export const getDb = cache(() => {
  const connectionString = process.env.DATABASE_URL ?? ""
  const adapter = new PrismaPg({ connectionString, maxUses: 1 })
  const prisma = new PrismaClient({ adapter })
  return prisma
})

const prisma = getDb()
export default prisma
