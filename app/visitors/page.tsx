import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { SetHomeCityForm } from "@/components/set-home-city-form"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemMedia,
  ItemDescription,
} from "@/components/ui/item"
import { ChevronLeft, Dot, Home, MapPin, Plane } from "lucide-react"
import { Route } from "next"
import { formatDateRange, getFirstName } from "@/lib/utils"
import { getUrl } from "@/lib/storage"
import { getInitials } from "@/lib/utils"
import { UserAvatar } from "@/components/user-avatar"

export const metadata = {
  title: "Visitors",
  description: "See who's visiting your home city",
}

export default async function VisitorsPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  const user = await userRepository.findById(userId)
  if (!user) redirect("/login")

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${userId}` as Route}>
            <ChevronLeft /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Visitors</h1>
      </div>

      {!user.homeCity ? (
        <Empty>
          <EmptyMedia>
            <MapPin className="size-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Set your home city</EmptyTitle>
            <EmptyDescription>
              Tell us where you live so we can show you who&apos;s visiting.
            </EmptyDescription>
          </EmptyHeader>
          <div className="w-full max-w-xs">
            <SetHomeCityForm />
          </div>
        </Empty>
      ) : (
        <VisitorsList city={user.homeCity} userId={userId} />
      )}
    </div>
  )
}

async function VisitorsList({
  city,
  userId,
}: {
  city: string
  userId: number
}) {
  const visits = await visitRepository.findUpcomingByCity(city, userId)

  if (visits.length === 0) {
    return (
      <Empty>
        <EmptyMedia>
          <Plane className="size-12" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No upcoming visitors</EmptyTitle>
          <EmptyDescription>
            Nobody has trips planned to {city} yet. Share your profile so
            friends can find you!
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ItemGroup>
      {visits.map((visit) => {
        const activities = visit.activities.map((a) => a.activity.name)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const arrive = new Date(visit.arriveAt)
        arrive.setHours(0, 0, 0, 0)
        const depart = new Date(visit.departAt)
        depart.setHours(0, 0, 0, 0)
        const daysUntil = Math.round(
          (arrive.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
        const isOngoing = today >= arrive && today <= depart

        return (
          <Item key={visit.id} variant="outline" asChild>
            <Link href={`/visit/${visit.id}`}>
              <ItemMedia variant="image">
                <UserAvatar user={visit.user} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text- flex items-center gap-0.5">
                  {visit.user.name ?? `User ${visit.user.id}`} <Dot size={12} />
                  <span className="flex items-center gap-0.5 font-medium text-muted-foreground">
                    <Home className="size-4" />
                    {visit.user.homeCity}
                  </span>
                </ItemTitle>

                <ItemDescription>
                  <span className="flex items-center gap-1.5">
                    {formatDateRange(visit.arriveAt, visit.departAt)}
                    {activities.length > 0 && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        {activities.slice(0, 2).join(", ")}
                        {activities.length > 2 && ` +${activities.length - 2}`}
                      </>
                    )}
                  </span>
                </ItemDescription>
              </ItemContent>
              <div className="ml-auto text-right text-xs text-muted-foreground">
                {isOngoing ? (
                  <span className="font-medium text-foreground">Here now</span>
                ) : (
                  <span>in {daysUntil} days</span>
                )}
              </div>
            </Link>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
