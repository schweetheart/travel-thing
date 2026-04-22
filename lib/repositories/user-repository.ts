import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export type { User } from "@prisma/client"

export const userRepository = {
  async findAll() {
    return prisma.user.findMany({ orderBy: { id: "asc" } })
  },

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } })
  },

  async upsert(id: number) {
    return prisma.user.upsert({
      where: { id },
      create: { id },
      update: {},
    })
  },

  async update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    })
  },

  async delete(id: number) {
    return prisma.user.delete({ where: { id } })
  },
}
