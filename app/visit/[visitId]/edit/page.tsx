import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { TripForm } from "@/components/trip-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Route } from "next"

export default async function EditTripPage({
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
  if (!visit || visit.userId !== userId) notFound()

  const activities = visit.activities.map((a) => a.activity.name)

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/visit/${visitId}` as Route}>
            <ChevronLeft /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Trip</h1>
      </div>
      <TripForm
        visit={{
          id: visit.id,
          city: visit.location.city,
          arriveAt: visit.arriveAt,
          departAt: visit.departAt,
          displayName: visit.displayName,
          activities,
        }}
      />
    </div>
  )
}
