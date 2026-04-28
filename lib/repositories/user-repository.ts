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
  async create(clerkId: string) {
    return getDb().user.create({ data: { clerkId } })
  },

  async upsertByClerkId(clerkId: string) {
    return getDb().user.upsert({
      where: { clerkId },
      create: { clerkId },
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

  async areFriends(currentUserId: number | null, targetId: number) {
    if (!currentUserId) return false
    const user = await getDb().user.findFirst({
      where: {
        id: currentUserId,
        OR: [
          { friends: { some: { id: targetId } } },
          { friendsOf: { some: { id: targetId } } },
        ],
      },
    })
    return !!user
  },

  async findFriends(userId: number) {
    const user = await getDb().user.findUnique({
      where: { id: userId },
      select: {
        friends: { include: { location: true } },
        friendsOf: { include: { location: true } },
      },
    })
    if (!user) return []
    const seen = new Set<number>()
    const all = [...user.friends, ...user.friendsOf]
    return all.filter((f) => {
      if (seen.has(f.id)) return false
      seen.add(f.id)
      return true
    })
  },

  async addFriend(userId: number, targetId: number) {
    return getDb().user.update({
      where: { id: userId },
      data: { friends: { connect: { id: targetId } } },
    })
  },

  async removeFriend(userId: number, targetId: number) {
    return getDb().user.update({
      where: { id: userId },
      data: {
        friends: { disconnect: { id: targetId } },
        friendsOf: { disconnect: { id: targetId } },
      },
    })
  },
  getByClerkId(clerkId: string) {
    return getDb().user.findUnique({
      where: { clerkId },
    })
  },
}
