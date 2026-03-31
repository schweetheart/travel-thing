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
import { TripForm } from "@/components/trip-form"

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
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

  const showEditButtons = visit.userId === userId

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/"> Back</Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {visit.user.name?.split(" ")[0]}&apos;s Trip to {visit.location.city}
        </h1>
      </div>
      {showEditButtons ? (
        <div className="flex gap-2">
          <form action={deleteVisitAction}>
            <input type="hidden" name="visitId" value={visit.id} />
            <Button variant="destructive">Delete</Button>
          </form>
          <TripForm
            visit={{
              id: visit.id,
              city: visit.location.city,
              arriveAt: visit.arriveAt,
              departAt: visit.departAt,
            }}
          />
        </div>
      ) : (
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
          <Button>Join this trip</Button>
        </form>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{visit.location.city}</CardTitle>
          <CardDescription>
            {formatDate(visit.arriveAt)} — {formatDate(visit.departAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          {visit.description && (
            <p className="text-foreground">{visit.description}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Who else will be there?</CardTitle>
          <CardDescription>
            People visiting {visit.location.city} with overlapping dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {friendsOverlapping.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No one else is visiting {visit.location.city} during this time.
              Feels lowkey solo rn 😔
            </p>
          ) : (
            <ItemGroup>
              {friendsOverlapping.map((ov) => {
                const overlapStart = new Date(
                  Math.max(visit.arriveAt.getTime(), ov.arriveAt.getTime())
                )
                const overlapEnd = new Date(
                  Math.min(visit.departAt.getTime(), ov.departAt.getTime())
                )
                const days = Math.ceil(
                  (overlapEnd.getTime() - overlapStart.getTime()) /
                    (1000 * 60 * 60 * 24)
                )
                const initials = (ov.user.name ?? `#${ov.user.id}`)
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()

                return (
                  <Item key={ov.id} asChild>
                    <Link href={`/${ov.user.id}`}>
                      <ItemMedia variant="image" className="rounded-full">
                        <img src="https://picsum.photos/200" />
                        {/* <div className="flex size-10 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {initials}
                        </div> */}
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>
                          {ov.user.name || `User #${ov.user.id}`}
                        </ItemTitle>
                        <ItemDescription>
                          {formatDate(ov.arriveAt)} — {formatDate(ov.departAt)}
                        </ItemDescription>
                      </ItemContent>
                      <Badge variant="secondary">
                        {days} day{days !== 1 ? "s" : ""}
                      </Badge>
                    </Link>
                  </Item>
                )
              })}
            </ItemGroup>
          )}
        </CardContent>
      </Card>
      {
        // We could show some fun stats, eg how many times you have been to this location
      }
    </div>
  )
}
