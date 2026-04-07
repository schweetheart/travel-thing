import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
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
import { MapPin, MoreVertical, Section } from "lucide-react"

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

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

  const friendsOverlapping = await visitRepository.overlappingVisits(id)
  const activities = visit.activities.map((a) => a.activity.name)

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

  const friendActivities = Array.from(
    new Set(
      friendsOverlapping.flatMap((ov) =>
        ov.activities.map((a) => a.activity.name)
      )
    )
  ).filter((name) => !activities.includes(name))

  const showEditButtons = visit.userId === userId
  const canSuggestActivities =
    friendActivities.length > 0 && activities && userId

  const tripName = visit.displayName ?? visit.location.city

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <VisitHeader visit={visit} />
      <Item asChild className="group" variant={"outline"}>
        <Link href={`/${visit.user.id}`}>
          <ItemMedia variant="image">
            <img src={`https://picsum.photos/200`} alt={visit.location.city} />
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
      <div>
        {/* <SectionTitle>Activities</SectionTitle> */}

        <ActivityList
          visitId={visit.id}
          initialActivities={activities}
          activityFriendMap={activityFriendMap}
        />
      </div>

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

      <div>
        <SectionTitle>Whos there</SectionTitle>
        {friendsOverlapping.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No one else is visiting {visit.location.city} during this time.
            Feels lowkey solo rn 😔
          </p>
        ) : (
          <ItemGroup>
            {friendsOverlapping.map((ov) => {
              return (
                <Item key={ov.id} variant={"outline"} asChild>
                  <Link href={`/${ov.user.id}`} key={ov.id}>
                    <ItemMedia variant="image">
                      <img src="https://picsum.photos/200" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        {ov.user.name || `User #${ov.user.id}`}
                      </ItemTitle>
                    </ItemContent>
                  </Link>
                </Item>
              )
            })}
          </ItemGroup>
        )}
      </div>

      {
        // We could show some fun stats, eg how many times you have been to this location
      }
    </div>
  )
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold">{children}</h2>
)

const VisitDrawer = ({ id }: { id: string }) => (
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
        <Button variant="outline" asChild>
          <Link href={`/visit/${id}/edit` as Route}>Edit</Link>
        </Button>

        <form action={deleteVisitAction}>
          <input type="hidden" name="id" value={id} />
          <DeleteVisitButton />
        </form>
      </div>
    </DrawerContent>
  </Drawer>
)

const VisitHeader = ({
  visit,
}: {
  visit: NonNullable<Awaited<ReturnType<typeof visitRepository.findById>>>
}) => (
  <div className="flex justify-between gap-2">
    <div>
      <div className="text-2xl font-bold">
        {visit.displayName ?? visit.location.city}
      </div>
      <div className="text-sm text-muted-foreground">
        {formatDateRange(visit.arriveAt, visit.departAt)}
      </div>
    </div>

    <div className="flex items-center gap-2">
      <ShareButton />
      <VisitDrawer id={visit.id.toString()} />
    </div>
  </div>
)
