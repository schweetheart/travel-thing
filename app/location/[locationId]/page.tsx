import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"
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
import { ChevronLeft, Dot, Home, Plane } from "lucide-react"
import { Route } from "next"
import { formatDateRange } from "@/lib/utils"
import { UserAvatar } from "@/components/user-avatar"

type Props = {
  params: Promise<{ locationId: string }>
}

export default async function LocationPage({ params }: Props) {
  const { locationId: rawId } = await params
  const locationId = parseInt(rawId, 10)
  if (isNaN(locationId)) notFound()

  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  const location = await visitRepository.findLocationById(locationId)
  if (!location) notFound()

  const visits = await visitRepository.findUpcomingByLocationId(
    locationId,
    userId
  )

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${userId}` as Route}>
            <ChevronLeft /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{location.city}</h1>
      </div>

      {visits.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Plane className="size-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No upcoming visitors</EmptyTitle>
            <EmptyDescription>
              Nobody else has trips planned to {location.city} yet.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
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
                    <ItemTitle className="flex items-center gap-0.5">
                      {visit.user.name ?? `User ${visit.user.id}`}
                      {visit.user.homeCity && (
                        <>
                          <Dot size={12} />
                          <span className="flex items-center gap-0.5 font-medium text-muted-foreground">
                            <Home className="size-4" />
                            {visit.user.homeCity}
                          </span>
                        </>
                      )}
                    </ItemTitle>
                    <ItemDescription>
                      <span className="flex items-center gap-1.5">
                        {formatDateRange(visit.arriveAt, visit.departAt)}
                        {activities.length > 0 && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            {activities.slice(0, 2).join(", ")}
                            {activities.length > 2 &&
                              ` +${activities.length - 2}`}
                          </>
                        )}
                      </span>
                    </ItemDescription>
                  </ItemContent>
                  <div className="ml-auto text-right text-xs text-muted-foreground">
                    {isOngoing ? (
                      <span className="font-medium text-foreground">
                        Here now
                      </span>
                    ) : (
                      <span>in {daysUntil} days</span>
                    )}
                  </div>
                </Link>
              </Item>
            )
          })}
        </ItemGroup>
      )}
    </div>
  )
}
