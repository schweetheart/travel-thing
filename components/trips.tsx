import { visitRepository } from "@/lib/repositories/visit-repository"
import Link from "next/link"

import { Item, ItemGroup, ItemContent, ItemTitle } from "./ui/item"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "./ui/avatar"
import { formatDate } from "@/lib/utils"

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
            return (
              <Link key={visit.id} href={`/visit/${visit.id}`}>
                <Item key={visit.id} className="hover:bg-muted" size="lg">
                  <ItemContent>
                    <div className="flex items-center justify-between">
                      <ItemTitle className="text-lg">
                        {visit.location.city}
                      </ItemTitle>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(visit.arriveAt)} -{" "}
                        {formatDate(visit.departAt)}
                      </span>
                    </div>

                    {visit.location._count.visits == 0 && (
                      <div className="text-sm text-muted-foreground">
                        No friends visiting
                      </div>
                    )}
                    {visit.location.visits.length > 0 && (
                      <div className="mt-1 flex items-center gap-2">
                        <AvatarGroup>
                          {visit.location.visits.map((v) => (
                            <Avatar key={v.id} size="sm">
                              <AvatarFallback>
                                {v.user.name
                                  ? v.user.name.charAt(0).toUpperCase()
                                  : "?"}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {visit.location._count.visits > 3 && (
                            <AvatarGroupCount>
                              +{visit.location._count.visits - 3}
                            </AvatarGroupCount>
                          )}
                        </AvatarGroup>
                        <span className="text-sm text-muted-foreground">
                          {visit.location.visits
                            .map((v) => v.user?.name ?? "?")
                            .join(", ")}
                          {visit.location._count.visits > 3 &&
                            ` +${visit.location._count.visits - 3} more`}
                        </span>
                      </div>
                    )}
                  </ItemContent>
                </Item>
              </Link>
            )
          })}
        </ItemGroup>
      )}
    </>
  )
}
