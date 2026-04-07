import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"
import { TripForm } from "@/components/trip-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Route } from "next"

export default async function CreateTripPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${userId}` as Route}>
            <ChevronLeft /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">New Trip</h1>
      </div>
      <TripForm />
    </div>
  )
}
