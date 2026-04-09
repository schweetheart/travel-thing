import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { getUrl } from "@/lib/storage"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Users } from "lucide-react"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { getInitials } from "@/lib/utils"

export const metadata = {
  title: "Friends",
  description: "Your friends list",
}

export default async function FriendsPage() {
  const currentUserId = await getCurrentUserId()
  if (!currentUserId) notFound()

  const users = await userRepository.findAll()

  // Filter out the current user
  const otherUsers = users.filter((u) => u.id !== currentUserId)

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 font-heading text-2xl font-bold">Friends</h1>

      {otherUsers.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Users className="size-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No friends yet</EmptyTitle>
            <EmptyDescription>
              When people join, they&apos;ll show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ItemGroup>
          {otherUsers.map((user) => (
            <Item key={user.id} variant="outline" asChild>
              <Link href={`/${user.id}`}>
                <ItemMedia variant="image">
                  {user.profileImageKey ? (
                    <Image
                      src={getUrl(user.profileImageKey)}
                      alt={user.name ?? "User avatar"}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-accent text-xs font-medium">
                      {getInitials(user.name)}
                    </div>
                  )}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{user.name ?? `User ${user.id}`}</ItemTitle>
                  {user.homeCity && (
                    <ItemDescription>{user.homeCity}</ItemDescription>
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
