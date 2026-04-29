import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { redirect } from "next/navigation"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Users } from "lucide-react"
import type { Metadata } from "next"
import { UserList } from "@/components/user-list"

export const metadata: Metadata = {
  title: "Friends",
}

export default async function FriendsPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  const friends = await userRepository.findFriends(userId)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Friends</h1>

      {friends.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Users />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No friends yet</EmptyTitle>
            <EmptyDescription>
              Share your profile link to connect with friends.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <UserList users={friends} />
      )}
    </div>
  )
}
