import { visitRepository } from "@/lib/repositories/visit-repository"
import Link from "next/link"

import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "./ui/item"
import { formatDateRange } from "@/lib/utils"

function Dot() {
  return <span className="text-muted-foreground">·</span>
}

type Trips = Awaited<ReturnType<typeof visitRepository.findByUser>>

export const Trips = ({ trips }: { trips: Trips }) => {
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
              <Item key={visit.id} asChild className="flex-nowrap">
                <Link href={`/visit/${visit.id}`}>
                  {/*            <ItemMedia className="size-16 flex-col gap-0 rounded-xl bg-accent text-center leading-none">
                    <UserAvatar user={visit.user} />
                    <div>
                      {isOngoing ? (
                        <span className="text-xs font-medium text-muted-foreground">
                          now
                        </span>
                      ) : daysUntil > 0 ? (
                        <>
                          <span className="text-sm text-muted-foreground">
                            {daysUntil} days
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                          past
                        </span>
                      )}
                    </div>
                  </ItemMedia> */}

                  <ItemContent className="overflow-hidden">
                    <div className="flex justify-between gap-2">
                      <div>
                        {/* <div>{visit.user.name}</div> */}
                        <ItemTitle className="line-clamp-1">
                          {visit.displayName ?? visit.location.city}
                        </ItemTitle>
                        {/*                        {visit.viewerOverlaps && (
                          <Badge variant="secondary" className="text-xs">
                            You&apos;re there too
                          </Badge>
                        )} */}
                      </div>
                      <div className="shrink-0 text-muted-foreground">
                        {formatDateRange(visit.arriveAt, visit.departAt)}
                      </div>
                    </div>

                    <div>
                      {/*       <ItemDescription className="w-2xs">
                        <span className="flex items-center gap-1">
                          {activities.map((name, i) => (
                            <span
                              key={name}
                              className="flex shrink-0 items-center gap-1"
                            >
                              {i > 0 && <Dot />}
                              {name}
                            </span>
                          ))}
                        </span>
                      </ItemDescription> */}
                      {activities.length > 0 && (
                        <ItemDescription className="flex gap-1">
                          {activities.map((name, i) => (
                            <span
                              key={name}
                              className="flex shrink-0 items-center gap-1"
                            >
                              {i > 0 && <Dot />}
                              {name}
                            </span>
                          ))}
                        </ItemDescription>
                      )}

                      {/*  {visit.location.visits.length > 0 && (
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
                        )} */}
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

const Notification = ({ children }: { children: React.ReactNode }) => (
  <div className="inline- relative">
    {children}
    <div className="absolute top-0 right-0 flex size-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
      <span className="relative inline-flex size-3 rounded-full bg-purple-500"></span>
    </div>
  </div>
)
