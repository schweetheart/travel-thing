import { ProfileHeader } from "@/components/profile-header"
import { Trips } from "@/components/trips"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { getCurrentUserId } from "@/lib/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { TripForm } from "@/components/trip-form"
interface ProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: `Profile - ${id}`,
    description: "User profile page",
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params

  if (isNaN(parseInt(id, 10))) notFound()

  const currentUserId = await getCurrentUserId()
  if (!currentUserId) notFound()

  const trips = await visitRepository.findByUser(parseInt(id, 10), {
    upcomingOnly: true,
  })

  const pastTrips = await visitRepository.findByUser(parseInt(id, 10), {
    upcomingOnly: false,
  })

  if (!trips) notFound()

  if (!currentUserId) notFound()

  return (
    <div>
      <div className="bg-accent/50 p-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProfileHeader userId={parseInt(id, 10)} />
        </Suspense>
      </div>

      <div className="mx-auto max-w-3xl p-6">
        <SectionHeader>
          <div className="flex justify-between gap-2">
            <Button
              variant={"secondary"}
              className="border-color-accent border"
            >
              Upcoming
              <span className="text-muted-foreground">{trips.length}</span>
            </Button>
            <Button variant={"secondary"}>
              Past
              <span className="text-muted-foreground">{pastTrips.length}</span>
            </Button>
          </div>
          {currentUserId === parseInt(id, 10) && (
            <TripForm
              trigger={
                <Button>
                  <Plus /> Add trip
                </Button>
              }
            />
          )}
        </SectionHeader>
      </div>
      <div className="mt-6 px-3">
        <Suspense fallback={<LoadingSkeleton />}>
          <Trips trips={trips} />
        </Suspense>
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
