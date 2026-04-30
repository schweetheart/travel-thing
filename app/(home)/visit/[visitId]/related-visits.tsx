import { Trips } from "@/components/trips"
import { visitRepository } from "@/lib/repositories/visit-repository"

export const RelatedVisits = async ({ id }: { id: number }) => {
  const trips = await visitRepository.findRelated(id)

  return <Trips trips={trips} />
}
