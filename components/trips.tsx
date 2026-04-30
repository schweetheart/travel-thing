import { visitRepository } from "@/lib/repositories/visit-repository"
import Link from "next/link"

import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
} from "./ui/item"
import { formatDateRange } from "@/lib/utils"
import { getCurrentUserId } from "@/lib/auth"
import { UserAvatar } from "./user-avatar"

function Dot() {
  return <span className="text-muted-foreground">·</span>
}

type Trips = Awaited<ReturnType<typeof visitRepository.findByUser>>

export const Trips = async ({ trips }: { trips: Trips }) => {
  const currentUserId = await getCurrentUserId()
  const visits = trips
  return (
    <>
      {visits.length === 0 ? (
        <p className="px-4 py-4 text-sm text-muted-foreground">
          No trips found.
        </p>
      ) : (
        <ItemGroup>
          {visits.map((visit) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const arrive = new Date(visit.arriveAt)
            arrive.setHours(0, 0, 0, 0)
            const depart = new Date(visit.departAt)
            depart.setHours(0, 0, 0, 0)

            const isOngoing = arrive <= today && depart >= today
            const daysUntil = Math.ceil(
              (arrive.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            )

            return (
              <Item key={visit.id} asChild className="flex-nowrap">
                <Link href={`/visit/${visit.id}`}>
                  <ItemMedia className="size-16 flex-col gap-0.5 rounded-xl bg-accent text-center leading-none">
                    {visit.userId !== currentUserId ? (
                      <>
                        <UserAvatar user={visit.user} />
                        <div>
                          {isOngoing ? (
                            <span className="text-[10px] font-medium text-muted-foreground">
                              now
                            </span>
                          ) : daysUntil > 0 ? (
                            <div className="flex items-baseline justify-center gap-0.5">
                              <span className="text-sm font-semibold">
                                {daysUntil}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                d
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-medium text-muted-foreground">
                              past
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div>
                        {isOngoing ? (
                          <span className="text-xs font-medium text-muted-foreground">
                            now
                          </span>
                        ) : daysUntil > 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-semibold">
                              {daysUntil}
                            </span>
                            <span className="font-medium text-muted-foreground">
                              days
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">
                            past
                          </span>
                        )}
                      </div>
                    )}
                  </ItemMedia>

                  <ItemContent className="overflow-hidden">
                    <div className="flex justify-between gap-2">
                      <div>
                        <ItemTitle className="line-clamp-1">
                          {visit.displayName ?? visit.location.city}
                        </ItemTitle>
                      </div>
                      <div className="shrink-0 text-muted-foreground">
                        {formatDateRange(visit.arriveAt, visit.departAt)}
                      </div>
                    </div>

                    <div>
                      {visit.activities.length > 0 && (
                        <ItemDescription className="flex gap-1">
                          {visit.activities.map((activity, i) => (
                            <span
                              key={activity.id}
                              className="flex shrink-0 items-center gap-1"
                            >
                              {i > 0 && <Dot />}
                              {activity.name}
                            </span>
                          ))}
                        </ItemDescription>
                      )}
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
