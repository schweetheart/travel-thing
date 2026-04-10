import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { Button } from "@/components/ui/button"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { createVisitAction, deleteVisitAction } from "@/app/actions"
import { ShareButton } from "@/components/share-button"
import { DeleteVisitButton } from "@/components/delete-visit-button"
import { formatDateRange } from "@/lib/utils"
import { ActivityList } from "@/components/activity-list"
import { Route } from "next"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { MapPin, MoreVertical, Omega, Section } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ visitId: string }>
}) {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  const { visitId } = await params
  const id = parseInt(visitId, 10)
  if (isNaN(id)) notFound()

  const visit = await visitRepository.findById(id)
  if (!visit) notFound()

  const friendsOverlapping = await visitRepository.overlappingVisits(visit.id)

  const activities = visit.activities.map((a) => ({
    name: a.activity.name,
    url: a.activity.url,
  }))

  // Map activity name → list of friend names doing that activity
  const activityFriendMap: Record<string, string[]> = {}
  for (const ov of friendsOverlapping) {
    const name = ov.user.name || `User #${ov.user.id}`
    for (const a of ov.activities) {
      const act = a.activity.name
      if (!activityFriendMap[act]) activityFriendMap[act] = []
      activityFriendMap[act].push(name)
    }
  }

  const activityNames = activities.map((a) => a.name)

  const friendActivities = Array.from(
    new Set(
      friendsOverlapping.flatMap((ov) =>
        ov.activities.map((a) => a.activity.name)
      )
    )
  ).filter((name) => !activityNames.includes(name))

  const showEditButtons = visit.userId === userId

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <Item asChild className="group">
        <Link href={`/${visit.user.id}`}>
          <ItemMedia variant="image">
            <UserAvatar user={visit.user} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="group-hover:underline">
              {visit.user.name}
            </ItemTitle>
            <ItemDescription className="flex items-center gap-1">
              <MapPin className="size-3" /> {visit.user.homeCity}
            </ItemDescription>
          </ItemContent>
        </Link>
      </Item>
      <VisitHeader visit={visit} showEditButtons={showEditButtons} />
      <OverlappingTrips tripId={visit.id} />

      <div>
        <SectionTitle>Plans</SectionTitle>

        <ActivityList
          visitId={visit.id}
          initialActivities={activities}
          activityFriendMap={activityFriendMap}
          canEdit={showEditButtons}
        />
      </div>
      {showEditButtons && friendActivities.length > 0 && (
        <div>
          <SectionTitle>Suggested</SectionTitle>
          <div className="text-sm text-muted-foreground">
            Based on what other friends are doing
          </div>
          <ItemGroup>
            {friendActivities.map((name) => (
              <Item key={name} variant={"outline"}>
                <ItemContent>
                  <ItemTitle>{name}</ItemTitle>
                  {activityFriendMap[name] && (
                    <ItemDescription>
                      {activityFriendMap[name].join(", ")}
                    </ItemDescription>
                  )}
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </div>
      )}
    </div>
  )
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold">{children}</h2>
)

const VisitDrawer = ({
  visit,
  showEditButtons,
}: {
  visit: NonNullable<Awaited<ReturnType<typeof visitRepository.findById>>>
  showEditButtons: boolean
}) => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button variant={"ghost"} size="icon">
        <MoreVertical />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader className="sr-only">
        <DrawerTitle>Manage Visit</DrawerTitle>
      </DrawerHeader>
      <div className="flex flex-col gap-2 p-4">
        <form action={createVisitAction}>
          <input type="hidden" name="city" value={visit.location.city} />
          <input
            type="hidden"
            name="arriveAt"
            value={visit.arriveAt.toISOString()}
          />
          <input
            type="hidden"
            name="departAt"
            value={visit.departAt.toISOString()}
          />
          <input
            type="hidden"
            name="displayName"
            value={visit.displayName ?? ""}
          />
          <Button type="submit" variant="outline" className="w-full">
            Copy into new Visit
          </Button>
        </form>
        {showEditButtons && (
          <>
            <Button variant="outline" asChild>
              <Link href={`/visit/${visit.id}/edit` as Route}>Edit</Link>
            </Button>
            <form action={deleteVisitAction}>
              <input type="hidden" name="id" value={visit.id} />
              <DeleteVisitButton />
            </form>
          </>
        )}
      </div>
    </DrawerContent>
  </Drawer>
)

const VisitHeader = ({
  visit,
  showEditButtons,
}: {
  visit: NonNullable<Awaited<ReturnType<typeof visitRepository.findById>>>
  showEditButtons: boolean
}) => (
  <div className="flex justify-between gap-2">
    <div>
      <Link
        href={`/location/${visit.location.id}`}
        className="text-2xl font-bold hover:underline"
      >
        {visit.displayName ?? visit.location.city}
      </Link>

      <div className="text-sm text-muted-foreground">
        {formatDateRange(visit.arriveAt, visit.departAt)}
      </div>
    </div>

    <div className="flex items-center gap-2">
      <ShareButton />
      <VisitDrawer visit={visit} showEditButtons={showEditButtons} />
    </div>
  </div>
)

const OverlappingTrips = async ({ tripId }: { tripId: number }) => {
  const friendsOverlapping = await visitRepository.overlappingVisits(tripId)

  return (
    <div>
      <SectionTitle>Also there</SectionTitle>
      {friendsOverlapping.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          We will notify you when friends have trips that overlap with this one.
        </p>
      ) : (
        <ItemGroup>
          {friendsOverlapping.map((ov) => {
            return (
              <Item key={ov.id} asChild>
                <Link href={`/visit/${ov.id}`} key={ov.id}>
                  <ItemMedia variant="image">
                    <UserAvatar user={ov.user} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {ov.user.name || `User #${ov.user.id}`}
                    </ItemTitle>
                    <ItemDescription>
                      {formatDateRange(ov.arriveAt, ov.departAt)}
                    </ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            )
          })}
        </ItemGroup>
      )}
    </div>
  )
}
