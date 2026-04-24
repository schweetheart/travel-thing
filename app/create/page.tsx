import { redirect } from "next/navigation"
import { getCurrentUserId } from "@/lib/auth"
import { TripForm } from "@/components/trip-form"

export default async function CreateTripPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">New Trip</h1>
      </div>
      <TripForm />
    </div>
  )
}
