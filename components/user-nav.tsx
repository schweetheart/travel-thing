import { getCurrentUserId } from "@/lib/auth"

import { Avatar, AvatarBadge } from "./ui/avatar"
import Link from "next/link"
import { userRepository } from "@/lib/repositories/user-repository"
import { AvatarContent } from "./user-avatar"
import { ChevronDown } from "lucide-react"

export const UserAvatar = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return null
  const user = await userRepository.findById(userId)
  if (!user) return null
  return (
    <Link href={`/${userId}/edit`}>
      <Avatar>
        <AvatarContent user={user} />
        <AvatarBadge className="bg-muted text-accent-foreground">
          <ChevronDown />
        </AvatarBadge>
      </Avatar>
    </Link>
  )
}
