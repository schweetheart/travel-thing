import { visitRepository } from "@/lib/repositories/visit-repository"

export async function getOverlappingCounts(visits: any[], userId: number) {
  // For each visit, count how many other users will be in the same city at the same time
  const counts = await Promise.all(
    visits.map(async (visit) => {
      const count = await visitRepository.countOverlappingVisits(
        visit.city,
        visit.arriveAt,
        visit.departAt,
        userId
      )
      return { visitId: visit.id, count }
    })
  )
  return Object.fromEntries(
    counts.map(({ visitId, count }) => [visitId, count])
  )
}
