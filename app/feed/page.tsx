import { redirect } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { Trips } from "@/components/trips"
import { FeedFilters } from "@/components/feed-filters"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { ChevronLeft, Compass } from "lucide-react"
import { Route } from "next"

export const metadata = {
  title: "Feed",
  description: "See all your friends' trips",
}

type Props = {
  searchParams: Promise<{
    city?: string
    friendId?: string
    arriveAfter?: string
    departBefore?: string
  }>
}

export default async function FeedPage({ searchParams }: Props) {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  const sp = await searchParams

  const filters: Parameters<typeof visitRepository.findFeed>[1] = {}

  if (sp.city) filters.city = sp.city
  if (sp.friendId) {
    const parsed = parseInt(sp.friendId, 10)
    if (!isNaN(parsed)) filters.friendId = parsed
  }
  if (sp.arriveAfter) {
    const d = new Date(sp.arriveAfter)
    if (!isNaN(d.getTime())) filters.arriveAfter = d
  }
  if (sp.departBefore) {
    const d = new Date(sp.departBefore)
    if (!isNaN(d.getTime())) filters.departBefore = d
  }

  const [trips, locations, users, currentUser] = await Promise.all([
    visitRepository.findFeed(userId, filters),
    visitRepository.findAllLocations(),
    userRepository.findAll(),
    userRepository.findById(userId),
  ])

  const friends = users.filter((u) => u.id !== userId)

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${userId}` as Route}>
            <ChevronLeft /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Feed</h1>
      </div>

      <Suspense>
        <FeedFilters
          locations={locations}
          friends={friends}
          homeCity={currentUser?.homeCity ?? null}
        />
      </Suspense>

      {trips.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Compass className="size-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No trips found</EmptyTitle>
            <EmptyDescription>
              {Object.keys(filters).length > 0
                ? "No trips match your filters. Try adjusting them."
                : "None of your friends have any trips yet."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Trips trips={trips} />
      )}
    </div>
  )
}
