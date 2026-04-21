import { getCurrentUserId } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"

export default async function Page() {
  const userId = await getCurrentUserId()

  if (!userId) notFound()

  return redirect(`/${userId}`)
}
