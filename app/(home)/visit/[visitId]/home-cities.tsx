import { UserList } from "@/components/user-list"
import { getDb } from "@/lib/db"
import { visitRepository } from "@/lib/repositories/visit-repository"

export const HomeCities = async ({ id }: { id: number }) => {
  // Given a visit/tripID. SHow the list of friends who have been to the same city as the visit/trip

  // get th city of the visit
  const visit = await visitRepository.findById(id)
  if (!visit) return null

  const locationId = visit.locationId

  const friends = await getDb().user.findMany({
    where: {
      locationId: locationId,
    },
    include: {
      location: true,
    },
  })

  if (friends.length === 0)
    return <div>No friends live in {visit.location.city} yet.</div>

  return <UserList users={friends} />
}
