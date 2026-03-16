import prisma from "@/lib/prisma"

export const visitRepository = {
  async findByUser(userId: number) {
    return prisma.visit.findMany({
      where: { userId },
      orderBy: { arriveAt: "asc" },
    })
  },

  async countOverlappingVisits(city: string, arriveAt: Date, departAt: Date, excludeUserId: number) {
    return prisma.visit.count({
      where: {
        city: { equals: city, mode: "insensitive" },
        userId: { not: excludeUserId },
        arriveAt: { lt: departAt },
        departAt: { gt: arriveAt },
      },
    })
  },

  async findById(id: number) {
    return prisma.visit.findUnique({
      where: { id },
      include: { user: true },
    })
  },

  async create(data: {
    city: string
    arriveAt: Date
    departAt: Date
    userId: number
  }) {
    return prisma.visit.create({ data })
  },

  async update(
    id: number,
    data: { city?: string; arriveAt?: Date; departAt?: Date }
  ) {
    return prisma.visit.update({ where: { id }, data })
  },

  async delete(id: number) {
    return prisma.visit.delete({ where: { id } })
  },

  async findVisitorsByCity(city: string, excludeUserId: number) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return prisma.visit.findMany({
      where: {
        city: { equals: city, mode: "insensitive" },
        userId: { not: excludeUserId },
        departAt: { gte: today },
      },
      include: { user: true },
      orderBy: { arriveAt: "asc" },
    })
  },

  async findOverlapping(
    city: string,
    arriveAt: Date,
    departAt: Date,
    excludeUserId: number
  ) {
    return prisma.visit.findMany({
      where: {
        city,
        userId: { not: excludeUserId },
        arriveAt: { lt: departAt },
        departAt: { gt: arriveAt },
      },
      include: { user: true },
      orderBy: { arriveAt: "asc" },
    })
  },
}
