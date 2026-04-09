import { ProfileHeader } from "@/components/profile-header"
import { Trips } from "@/components/trips"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { getCurrentUserId } from "@/lib/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, MapPin, Users } from "lucide-react"
import Link from "next/link"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"

type ProfilePageProps = PageProps<"/[id]">

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: `Profile - ${id}`,
    description: "User profile page",
  }
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { id } = await params

  if (isNaN(parseInt(id, 10))) notFound()

  const currentUserId = await getCurrentUserId()
  if (!currentUserId) notFound()

  const profileUserId = parseInt(id, 10)

  const trips = await visitRepository.findByUser(profileUserId, {
    upcomingOnly: true,
    viewerUserId: currentUserId,
  })

  const now = new Date()
  const currentTrip = trips.find((t) => t.arriveAt <= now && t.departAt >= now)

  return (
    <div>
      <div className="p-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProfileHeader userId={profileUserId} />
        </Suspense>
      </div>
      <Separator />
      {currentTrip && (
        <div className="mx-auto max-w-3xl rounded-lg bg-amber-300 p-6">
          <Trips trips={[currentTrip]} />
        </div>
      )}

      <div className="mt-6 px-3">
        {trips.length === 0 ? (
          <EmptyTravel />
        ) : (
          <Suspense fallback={<LoadingSkeleton />}>
            <Trips trips={trips} />
          </Suspense>
        )}
      </div>
    </div>
  )
}

const EmptyTravel = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <MapPin />
      </EmptyMedia>
      <EmptyTitle>
        <Button asChild>
          <Link href="/create">Add a trip</Link>
        </Button>
      </EmptyTitle>
      <EmptyDescription>
        Add trips and see when youll be in the same place as your friends
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
)

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-1/3 rounded" />
    <Skeleton className="h-4 w-full rounded" />
    <Skeleton className="h-4 w-full rounded" />
    <Skeleton className="h-4 w-full rounded" />
  </div>
)
