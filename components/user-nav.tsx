import { getCurrentUserId } from "@/lib/auth"

import { Avatar, AvatarFallback } from "./ui/avatar"
import Link from "next/link"
import { userRepository } from "@/lib/repositories/user-repository"

export const UserAvatar = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return null
  const user = await userRepository.findById(userId)
  return (
    <Avatar asChild>
      <Link href={`/${userId}/edit`}>
        <AvatarFallback>{user?.name ? user.name[0] : "U"}</AvatarFallback>
      </Link>
    </Avatar>
  )
}
