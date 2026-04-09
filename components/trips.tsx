import { visitRepository } from "@/lib/repositories/visit-repository"
import Link from "next/link"

import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemMedia,
  ItemDescription,
} from "./ui/item"
import { AvatarGroup, AvatarGroupCount } from "./ui/avatar"
import { formatDateRange, getFirstName } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { getUrl } from "@/lib/storage"
import { getImageProps } from "next/image"
import { UserAvatar } from "./user-avatar"

function Dot() {
  return <span className="text-muted-foreground">·</span>
}

type Trips = Awaited<ReturnType<typeof visitRepository.findByUser>>

export const Trips = async ({ trips }: { trips: Trips }) => {
  const visits = trips
  return (
    <>
      {visits.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No trips yet. Add one above!
        </p>
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
              <Item key={visit.id} asChild>
                <Link href={`/visit/${visit.id}`}>
                  <ItemMedia
                    variant={"default"}
                    className="size-14 flex-col rounded-xl bg-accent text-center leading-none"
                  >
                    {isOngoing ? (
                      <span className="text-xs font-medium text-muted-foreground">
                        now
                      </span>
                    ) : daysUntil > 0 ? (
                      <>
                        <span className="text-xl font-bold tabular-nums">
                          {daysUntil}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          days
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        past
                      </span>
                    )}
                  </ItemMedia>
                  <ItemContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <ItemTitle>
                            {visit.displayName ?? visit.location.city}
                          </ItemTitle>

                          {visit.viewerOverlaps && (
                            <Badge variant="secondary" className="text-xs">
                              You&apos;re there too
                            </Badge>
                          )}
                        </div>

                        <ItemDescription>
                          <span className="flex items-center gap-1.5">
                            {activities.map((name, i) => (
                              <span
                                key={name}
                                className="flex shrink-0 items-center gap-1.5"
                              >
                                {i > 0 && <Dot />}
                                {name}
                              </span>
                            ))}
                          </span>
                        </ItemDescription>

                        {visit.location.visits.length > 0 && (
                          <div className="mt-1 flex items-center gap-2">
                            <AvatarGroup>
                              {visit.location.visits.map((v) => {
                                return <UserAvatar key={v.id} user={v.user} />
                              })}
                              {visit.location._count.visits > 3 && (
                                <AvatarGroupCount>
                                  +{visit.location._count.visits - 3}
                                </AvatarGroupCount>
                              )}
                            </AvatarGroup>
                            <span className="text-muted-foreground">
                              {visit.location.visits
                                .map((v) => getFirstName(v.user?.name ?? "?"))
                                .join(", ")}
                              {visit.location._count.visits > 3 &&
                                ` +${visit.location._count.visits - 3} more`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-muted-foreground">
                          {formatDateRange(visit.arriveAt, visit.departAt)}
                        </span>
                        <span className="text-muted-foreground">
                          {visit.location.city}
                        </span>
                      </div>
                    </div>
                  </ItemContent>
                </Link>
              </Item>
            )
          })}
        </ItemGroup>
      )}
    </>
  )
}
