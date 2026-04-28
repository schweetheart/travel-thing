import { Trips } from "@/components/trips"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { redirect } from "next/navigation"

export default async function Page() {
  // Get all trips for the current user and friends
  const userId = await getCurrentUserId()

  if (!userId) {
    redirect("/sign-up")
  }

  const visits = await visitRepository.feedVisits(userId)

  return (
    <div>
      <Trips trips={visits} />
    </div>
  )
}
