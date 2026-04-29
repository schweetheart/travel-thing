import { redirect } from "next/navigation"
import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"

import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  const user = await userRepository.findById(userId)
  if (!user) redirect("/login")

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <div className="text-2xl font-bold">Edit Profile</div>
      <ProfileForm user={user} />
    </div>
  )
}
