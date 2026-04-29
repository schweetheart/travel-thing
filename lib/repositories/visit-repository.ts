import { getDb } from "@/lib/db"

export const visitRepository = {
  async findLocationById(locationId: number) {
    return getDb().location.findUnique({ where: { id: locationId } })
  },

  async findAllLocations() {
    return getDb().location.findMany({ orderBy: { city: "asc" } })
  },

  async feedVisits(userId: number) {
    return await getDb().visit.findMany({
      where: {
        departAt: { gte: new Date() },
        user: {
          friendsOf: {
            some: { id: userId },
          },
        },
      },
      include: {
        user: true,
        location: true,
        activities: { include: { activity: true } },
      },
      orderBy: { arriveAt: "asc" },
    })
  },

  async findRelated(id: number) {
    const visit = await getDb().visit.findUnique({
      where: { id },
      include: { location: true },
    })

    return getDb().visit.findMany({
      where: {
        locationId: visit?.locationId,
        departAt: { gte: new Date() },
        id: { not: id },
      },
      include: {
        user: true,
        location: true,
        activities: { include: { activity: true } },
      },
      orderBy: { arriveAt: "asc" },
    })
  },

  /**
   * Get all visits of a user, including the location and other visitors to that location (excluding the current user)
   */
  async findByUser(
    userId: number,
    { upcomingOnly }: { upcomingOnly?: boolean } = { upcomingOnly: false }
  ) {
    const today = new Date()

    return await getDb().visit.findMany({
      include: {
        user: true,
        activities: { include: { activity: true } },
        location: true,
      },
      where: { userId, departAt: upcomingOnly ? { gte: today } : undefined },
      orderBy: { arriveAt: "asc" },
    })

    // Prisma can't reference parent fields in nested where clauses, so we
    // filter co-visitors to only those whose stay overlaps with this trip.
    /*     return visits.map((visit) => {
      const overlapping = visit.location.visits.filter(
        (v) => v.arriveAt < visit.departAt && v.departAt > visit.arriveAt
      )
      const viewerOverlaps =
        viewerUserId != null &&
        viewerUserId !== userId &&
        overlapping.some((v) => v.userId === viewerUserId)
      return {
        ...visit,
        viewerOverlaps,
        location: {
          ...visit.location,
          visits: overlapping
            .filter((v) => v.userId !== viewerUserId)
            .slice(0, 3),
          _count: {
            visits: overlapping.filter((v) => v.userId !== viewerUserId).length,
          },
        },
      }
    }) */
  },

  // Get all users who have a visit that overlaps with the given visit ID

  async overlappingVisits(id: number) {
    // Get the current visit to find the location and dates
    const visit = await getDb().visit.findUnique({
      where: { id },
      include: { location: true },
    })
    if (!visit) return []

    // Find all users who have this location as their home city
    const homeCityUsers = await getDb().user.findMany({
      where: { locationId: visit.locationId },
    })

    // Find all users who have a visit that overlaps with the current visit
    const visitingUsers = await getDb().user.findMany({
      where: {
        NOT: { id: visit.userId },
        visits: {
          some: {
            locationId: visit.locationId,
            id: { not: visit.userId },
            AND: [
              { arriveAt: { lt: visit.departAt } },
              { departAt: { gt: visit.arriveAt } },
            ],
          },
        },
      },
    })

    return [...homeCityUsers, ...visitingUsers]
  },

  async create(data: {
    city: string
    arriveAt: Date
    departAt: Date
    userId: number
    displayName?: string | null
    activityNames?: string[]
  }) {
    return getDb().visit.create({
      data: {
        arriveAt: data.arriveAt,
        departAt: data.departAt,
        displayName: data.displayName,
        user: {
          connect: { id: data.userId },
        },
        location: {
          connectOrCreate: {
            where: { city: data.city },
            create: { city: data.city },
          },
        },
        activities: data.activityNames?.length
          ? {
              create: data.activityNames.map((name) => ({
                activity: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,
      },
    })
  },

  async update(
    id: number,
    data: {
      arriveAt?: Date
      departAt?: Date
      displayName?: string | null
      activityNames?: string[]
    }
  ) {
    return getDb().$transaction(async (tx) => {
      if (data.activityNames !== undefined) {
        await tx.visitActivity.deleteMany({ where: { visitId: id } })
        if (data.activityNames.length > 0) {
          for (const name of data.activityNames) {
            const activity = await tx.activity.upsert({
              where: { name },
              create: { name },
              update: {},
            })
            await tx.visitActivity.create({
              data: { visitId: id, activityId: activity.id },
            })
          }
        }
      }
      return tx.visit.update({
        where: { id },
        data: {
          arriveAt: data.arriveAt,
          departAt: data.departAt,
          displayName: data.displayName,
        },
      })
    })
  },

  async delete(id: number) {
    return getDb().visit.delete({ where: { id } })
  },

  async addActivity(visitId: number, activityName: string, url?: string) {
    const activity = await getDb().activity.upsert({
      where: { name: activityName },
      create: { name: activityName, url: url || null },
      update: url ? { url } : {},
    })
    // No-op if already linked
    const existing = await getDb().visitActivity.findFirst({
      where: { visitId, activityId: activity.id },
    })
    if (existing) return existing
    return getDb().visitActivity.create({
      data: { visitId, activityId: activity.id },
    })
  },

  async removeActivity(visitId: number, activityName: string) {
    const activity = await getDb().activity.findUnique({
      where: { name: activityName },
    })
    if (!activity) return
    await getDb().visitActivity.deleteMany({
      where: { visitId, activityId: activity.id },
    })
  },

  async findUpcomingByCity(city: string, excludeUserId?: number) {
    const today = new Date()
    return getDb().visit.findMany({
      where: {
        location: { city },
        departAt: { gte: today },
        ...(excludeUserId ? { userId: { not: excludeUserId } } : {}),
      },
      include: {
        user: true,
        location: true,
        activities: { include: { activity: true } },
      },
      orderBy: { arriveAt: "asc" },
    })
  },

  async findUpcomingByLocationId(locationId: number, excludeUserId?: number) {
    const today = new Date()
    return getDb().visit.findMany({
      where: {
        locationId,
        departAt: { gte: today },
        ...(excludeUserId ? { userId: { not: excludeUserId } } : {}),
      },
      include: {
        user: true,
        location: true,
        activities: { include: { activity: true } },
      },
      orderBy: { arriveAt: "asc" },
    })
  },

  async findById(id: number) {
    return getDb().visit.findUnique({
      where: { id },
      include: {
        user: {
          include: { location: true },
        },

        location: true,
        activities: { include: { activity: true } },
      },
    })
  },
}
