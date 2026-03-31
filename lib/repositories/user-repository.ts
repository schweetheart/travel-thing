import prisma from "@/lib/prisma"

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

  async update(
    id: number,
    data: { name?: string; homeCity?: string; instagramHandle?: string }
  ) {
    return prisma.user.update({
      where: { id },
      data,
    })
  },
}
