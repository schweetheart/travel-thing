import prisma from "@/lib/prisma"

export const visitRepository = {
  /**
   * Get all visits of a user, including the location and other visitors to that location (excluding the current user)
   */
  async findByUser(
    userId: number,
    { upcomingOnly }: { upcomingOnly?: boolean } = { upcomingOnly: false }
  ) {
    const today = new Date()

    return prisma.visit.findMany({
      include: {
        location: {
          include: {
            visits: {
              where: { userId: { not: userId } },
              include: { user: true },
              take: 3, // only show 3 visitors in the home city card to avoid clutter, we can show more in the visit details page
            },
            _count: {
              select: {
                visits: {
                  where: { userId: { not: userId } },
                },
              },
            },
          },
        },
      },

      where: { userId, departAt: upcomingOnly ? { gte: today } : undefined },
      orderBy: { arriveAt: "asc" },
    })
  },

  // getUsersBy visit

  async overlappingVisits(id: number) {
    // Get the current visit to find the location and dates
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: { location: true },
    })
    if (!visit) return []

    // Find other visits overlapping
    // We actually just want to see the individuals

    // Consider in the future showing the overlaping dates in the UI
    return await prisma.visit.findMany({
      where: {
        locationId: visit.locationId,
        id: { not: id },
        arriveAt: { lt: visit.departAt }, // their arrival is before your departure
        departAt: { gt: visit.arriveAt }, // their departure is after your arrival
      },
      include: { user: true },
      orderBy: { arriveAt: "asc" },
    })
  },

  async create(data: {
    city: string
    arriveAt: Date
    departAt: Date
    userId: number
  }) {
    return prisma.visit.create({
      data: {
        arriveAt: data.arriveAt,
        departAt: data.departAt,
        user: {
          connect: { id: data.userId },
        },
        location: {
          connectOrCreate: {
            where: { city: data.city },
            create: { city: data.city },
          },
        },
      },
    })
  },

  async update(id: number, data: { arriveAt?: Date; departAt?: Date }) {
    return prisma.visit.update({
      where: { id },
      data: {
        arriveAt: data.arriveAt,
        departAt: data.departAt,
      },
    })
  },

  async delete(id: number) {
    return prisma.visit.delete({ where: { id } })
  },

  async findById(id: number) {
    return prisma.visit.findUnique({
      where: { id },
      include: { user: true, location: true },
    })
  },

  async findVisitorsByCity(city: string, excludeUserId: number) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return prisma.visit.findMany({
      where: {
        location: { city: { equals: city, mode: "insensitive" } },
        userId: { not: excludeUserId },
        departAt: { gte: today },
      },
      include: { user: true },
      orderBy: { arriveAt: "asc" },
    })
  },
}
