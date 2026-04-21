import { ProfileHeader } from "@/components/profile-header"
import { Trips } from "@/components/trips"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin } from "lucide-react"
import Link from "next/link"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { userRepository } from "@/lib/repositories/user-repository"

type ProfilePageProps = PageProps<"/[id]">

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { id } = await params

  const user = await userRepository.findById(parseInt(id, 10))

  return {
    title: `${user?.name}`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params

  if (isNaN(parseInt(id, 10))) notFound()

  const profileUserId = parseInt(id, 10)

  return (
    <div>
      <div
        className="p-12"
        style={{
          background: `radial-gradient(50% 50%, rgba(158, 110, 230, 0.28) 0%, rgba(158, 110, 230, 0) 100%)`,
        }}
      >
        <Suspense fallback={<LoadingSkeleton />}>
          <ProfileHeader userId={profileUserId} />
        </Suspense>
      </div>
      <Separator />

      <div className="mt-6 px-2">
        <Suspense fallback={<TripListPlaceholder />}>
          <ProfileTrips userId={profileUserId} />
        </Suspense>
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
  <div className="flex flex-col items-center gap-4">
    <Skeleton className="size-40 rounded-full" />
    <Skeleton className="h-7 w-40 rounded" />
    <Skeleton className="h-4 w-48 rounded" />
    <Skeleton className="h-9 w-36 rounded-md" />
  </div>
)

const ProfileTrips = async ({ userId }: { userId: number }) => {
  const trips = await visitRepository.findByUser(userId, {
    upcomingOnly: true,
  })

  if (trips.length === 0) {
    return <EmptyTravel />
  }

  return <Trips trips={trips} />
}

const TripListPlaceholder = () => (
  <div className="m-4 flex flex-col gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="size-12 rounded" />
        <div className="flex-1">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="mt-1 h-3 w-3/4 rounded" />
        </div>
      </div>
    ))}
  </div>
)
