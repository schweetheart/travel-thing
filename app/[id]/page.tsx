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
import { TravelViewSwitcher } from "@/components/travel-view-switcher"
import { ShareButton } from "@/components/share-button"

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
  const { view } = await searchParams

  if (isNaN(parseInt(id, 10))) notFound()

  const currentUserId = await getCurrentUserId()
  if (!currentUserId) notFound()

  const profileUserId = parseInt(id, 10)
  const isOwnProfile = currentUserId === profileUserId
  const currentView = view === "mutual" && !isOwnProfile ? "mutual" : "all"

  const [trips, pastTrips] = await Promise.all([
    visitRepository.findByUser(profileUserId, {
      upcomingOnly: true,
      viewerUserId: currentUserId,
    }),
    visitRepository.findByUser(profileUserId, {
      upcomingOnly: false,
      viewerUserId: currentUserId,
    }),
  ])

  if (!trips) notFound()

  const now = new Date()
  const currentTrip = trips.find((t) => t.arriveAt <= now && t.departAt >= now)

  const upcomingTrips = trips.filter((t) => t !== currentTrip)
  const allTrips = [...upcomingTrips]
  const mutualTrips = allTrips.filter((t) => t.viewerOverlaps)

  const displayedTrips = currentView === "mutual" ? mutualTrips : allTrips

  return (
    <div>
      <div className="bg-accent/50 p-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProfileHeader userId={profileUserId} />
        </Suspense>
      </div>
      {currentTrip && (
        <div className="mx-auto max-w-3xl rounded-lg bg-accent/50 bg-amber-300 p-6">
          <Trips trips={[currentTrip]} />
        </div>
      )}

      <div className="mx-auto max-w-3xl p-6">
        {isOwnProfile && (
          <div className="mb-4 flex justify-end">
            <ShareButton />
          </div>
        )}
        <SectionHeader>
          {isOwnProfile ? (
            <div className="flex justify-between gap-2">
              <Button
                variant={"secondary"}
                className="border-color-accent border"
              >
                Upcoming
                <span className="text-muted-foreground">
                  {upcomingTrips.length}
                </span>
              </Button>
              <Button variant={"secondary"}>
                Past
                <span className="text-muted-foreground">
                  {pastTrips.length}
                </span>
              </Button>
            </div>
          ) : (
            <TravelViewSwitcher
              allCount={allTrips.length}
              mutualCount={mutualTrips.length}
              currentView={currentView}
            />
          )}
          {isOwnProfile && (
            <Button asChild>
              <Link href={"/create"}>
                <Plus /> Add trip
              </Link>
            </Button>
          )}
        </SectionHeader>
      </div>
      <div className="mt-6 px-3">
        {displayedTrips.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {currentView === "mutual" ? <Users /> : <MapPin />}
              </EmptyMedia>
              <EmptyTitle>
                {currentView === "mutual"
                  ? "No overlapping trips"
                  : "No trips yet"}
              </EmptyTitle>
              <EmptyDescription>
                {currentView === "mutual"
                  ? "No trips where you and this person overlap"
                  : "Add a trip above to get started"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Suspense fallback={<LoadingSkeleton />}>
            <Trips trips={displayedTrips} />
          </Suspense>
        )}
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-1/3 rounded" />
    <Skeleton className="h-4 w-full rounded" />
    <Skeleton className="h-4 w-full rounded" />
    <Skeleton className="h-4 w-full rounded" />
  </div>
)

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between">{children}</div>
)
