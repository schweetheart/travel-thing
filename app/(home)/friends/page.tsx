import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { AvatarContent } from "@/components/user-avatar"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Home, Users } from "lucide-react"
import type { Metadata } from "next"

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
        <ItemGroup>
          {friends.map((friend) => (
            <Item key={friend.id} variant="outline" asChild>
              <Link href={`/${friend.id}`}>
                <ItemMedia variant="image">
                  <Avatar className="size-10">
                    <AvatarContent user={friend} size={40} />
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{friend.name ?? "Unknown"}</ItemTitle>
                  {friend.location?.city && (
                    <ItemDescription className="flex items-center gap-1">
                      <Home />
                      {friend.location.city}
                    </ItemDescription>
                  )}
                </ItemContent>
              </Link>
            </Item>
          ))}
        </ItemGroup>
      )}
    </div>
  )
}
