import { Trips } from "@/components/trips"
import { Button } from "@/components/ui/button"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { auth } from "@clerk/nextjs/server"

export default async function Page() {
  // Get all trips for the current user and friends
  const userId = await getCurrentUserId()

  if (!userId) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }

  const visits = await visitRepository.feedVisits(userId)

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Button variant="outline">All</Button>
        <Button variant="outline">My trips</Button>
      </div>
      <Trips trips={visits} />
    </div>
  )
}
