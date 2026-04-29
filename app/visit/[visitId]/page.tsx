import { notFound } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { Button } from "@/components/ui/button"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ShareButton } from "@/components/share-button"
import {
  DeleteVisitButton,
  CopyVisitButton,
} from "@/components/delete-visit-button"
import { formatDateRange } from "@/lib/utils"
import { ActivityList } from "@/components/activity-list"
import { Route } from "next"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ChevronLeft, MapPin, MoreVertical } from "lucide-react"
import { RelatedVisits } from "./related-visits"
import { Suspense } from "react"
import { UserAvatar } from "@/components/user-avatar"

export default async function VisitDetailPage(
  props: PageProps<"/visit/[visitId]">
) {
  const { visitId } = await props.params
  const id = parseInt(visitId, 10)
  if (isNaN(id)) notFound()

  const visit = await visitRepository.findById(id)
  if (!visit) notFound()

  const activities = visit.activities.map((a) => ({
    name: a.activity.name,
    url: a.activity.url,
  }))

  const userId = await getCurrentUserId()

  const showEditButtons = visit.userId === userId

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center gap-2 border-b p-4">
        <Button variant="ghost" size="icon">
          <Link href={`/${visit.user.id}`}>
            <ChevronLeft />
          </Link>
        </Button>
        <div className="flex-1">
          <VisitHeader visit={visit} showEditButtons={showEditButtons} />
        </div>
      </div>
      <Item asChild className="group">
        <Link href={`/${visit.user.id}`}>
          <ItemMedia variant="image">
            <UserAvatar user={visit.user} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="flex items-center gap-1 group-hover:underline">
              {visit.user.name}
            </ItemTitle>
            <ItemDescription className="flex items-center gap-1">
              <MapPin className="size-3" />
              {visit.location.city}
            </ItemDescription>
          </ItemContent>
        </Link>
      </Item>

      <div className="px-4">
        <SectionTitle>Plans</SectionTitle>

        <ActivityList
          visitId={visit.id}
          initialActivities={activities}
          canEdit={showEditButtons}
        />
      </div>
      <div>
        <div className="px-4">
          <SectionTitle>Related Trips</SectionTitle>
        </div>
        <Suspense
          fallback={<div className="p-6">Loading related visits...</div>}
        >
          <RelatedVisits id={visit.id} />
        </Suspense>
      </div>
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
        <CopyVisitButton
          city={visit.location.city}
          arriveAt={visit.arriveAt}
          departAt={visit.departAt}
          displayName={visit.displayName}
        />
        {showEditButtons && (
          <>
            <Button variant="outline" asChild>
              <Link href={`/visit/${visit.id}/edit` as Route}>Edit</Link>
            </Button>
            <DeleteVisitButton visitId={visit.id} />
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
      <span className="text-xl font-bold hover:underline">
        {visit.displayName ?? visit.location.city}
      </span>

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
