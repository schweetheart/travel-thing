import prisma from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export const visitRepository = {
  async findLocationById(locationId: number) {
    return prisma.location.findUnique({ where: { id: locationId } })
  },

  async findAllLocations() {
    return prisma.location.findMany({ orderBy: { city: "asc" } })
  },

  async findFeed(
    viewerUserId: number,
    filters?: {
      city?: string
      friendId?: number
      arriveAfter?: Date
      departBefore?: Date
    }
  ) {
    const where: Prisma.VisitWhereInput = {
      userId: { not: viewerUserId },
      ...(filters?.friendId ? { userId: filters.friendId } : {}),
      ...(filters?.city ? { location: { city: filters.city } } : {}),
      ...(filters?.arriveAfter
        ? { arriveAt: { gte: filters.arriveAfter } }
        : {}),
      ...(filters?.departBefore
        ? { departAt: { lte: filters.departBefore } }
        : {}),
    }

    const visits = await prisma.visit.findMany({
      include: {
        activities: { include: { activity: true } },
        user: true,
        location: {
          include: {
            visits: {
              include: { user: true },
            },
          },
        },
      },
      where,
      orderBy: { departAt: "asc" },
    })

    return visits.map((visit) => {
      const overlapping = visit.location.visits.filter(
        (v) =>
          v.id !== visit.id &&
          v.arriveAt < visit.departAt &&
          v.departAt > visit.arriveAt
      )
      const viewerOverlaps = overlapping.some((v) => v.userId === viewerUserId)
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
    })
  },

  /**
   * Get all visits of a user, including the location and other visitors to that location (excluding the current user)
   */
  async findByUser(
    userId: number,
    {
      upcomingOnly,
      viewerUserId,
    }: { upcomingOnly?: boolean; viewerUserId?: number } = {
      upcomingOnly: false,
    }
  ) {
    const today = new Date()

    const visits = await prisma.visit.findMany({
      include: {
        activities: { include: { activity: true } },
        location: {
          include: {
            visits: {
              where: { userId: { not: userId } },
              include: { user: true },
            },
          },
        },
      },
      where: { userId, departAt: upcomingOnly ? { gte: today } : undefined },
      orderBy: { arriveAt: "asc" },
    })

    // Prisma can't reference parent fields in nested where clauses, so we
    // filter co-visitors to only those whose stay overlaps with this trip.
    return visits.map((visit) => {
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
        AND: [
          { arriveAt: { lt: visit.departAt } },
          { departAt: { gt: visit.arriveAt } },
        ],
      },
      include: { user: true, activities: { include: { activity: true } } },
      orderBy: { arriveAt: "asc" },
    })
  },

  async create(data: {
    city: string
    arriveAt: Date
    departAt: Date
    userId: number
    displayName?: string | null
    activityNames?: string[]
  }) {
    return prisma.visit.create({
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
    return prisma.$transaction(async (tx) => {
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
    return prisma.visit.delete({ where: { id } })
  },

  async addActivity(visitId: number, activityName: string, url?: string) {
    const activity = await prisma.activity.upsert({
      where: { name: activityName },
      create: { name: activityName, url: url || null },
      update: url ? { url } : {},
    })
    // No-op if already linked
    const existing = await prisma.visitActivity.findFirst({
      where: { visitId, activityId: activity.id },
    })
    if (existing) return existing
    return prisma.visitActivity.create({
      data: { visitId, activityId: activity.id },
    })
  },

  async removeActivity(visitId: number, activityName: string) {
    const activity = await prisma.activity.findUnique({
      where: { name: activityName },
    })
    if (!activity) return
    await prisma.visitActivity.deleteMany({
      where: { visitId, activityId: activity.id },
    })
  },

  async findUpcomingByCity(city: string, excludeUserId?: number) {
    const today = new Date()
    return prisma.visit.findMany({
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
    return prisma.visit.findMany({
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
    return prisma.visit.findUnique({
      where: { id },
      include: {
        user: true,
        location: true,
        activities: { include: { activity: true } },
      },
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
