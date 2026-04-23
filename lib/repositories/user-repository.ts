import { getDb } from "@/lib/db"
import { Prisma } from "@prisma/client"

export type { User } from "@prisma/client"

export const userRepository = {
  async findAll() {
    return getDb().user.findMany({
      orderBy: { id: "asc" },
      include: { location: true },
    })
  },

  async findById(id: number) {
    return getDb().user.findUnique({
      where: { id },
      include: { location: true },
    })
  },

  async upsert(id: number) {
    return getDb().user.upsert({
      where: { id },
      create: { id },
      update: {},
    })
  },

  async update(id: number, data: Prisma.UserUpdateInput) {
    return getDb().user.update({
      where: { id },
      data,
    })
  },

  async delete(id: number) {
    return getDb().user.delete({ where: { id } })
  },
}
