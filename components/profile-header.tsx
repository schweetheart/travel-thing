import { getCurrentUserId } from "@/lib/auth"

import { User, userRepository } from "@/lib/repositories/user-repository"

import Link from "next/link"

import { Dot, House, Instagram } from "lucide-react"
import { Button } from "./ui/button"
import { FileUpload } from "./upload-image"
import { ShareButton } from "./share-button"
import { AvatarContent } from "./user-avatar"
import { Avatar } from "./ui/avatar"
import {
  AddFriendButton,
  RemoveFriendButton,
  SignInToAddFriend,
} from "./friend-button"
import { notFound } from "next/navigation"

export const ProfileHeader = async ({ userId }: { userId: number }) => {
  const currentUserId = await getCurrentUserId()

  const user = await userRepository.findById(userId)

  if (!user) return notFound()

  const isOwnProfile = currentUserId === userId

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="size-40">
          <AvatarContent user={user} size={120} />
        </Avatar>
        {isOwnProfile && (
          <div className="absolute right-0 bottom-0">
            <FileUpload />
          </div>
        )}
      </div>

      <div className="text-2xl font-bold">{user.name}</div>
      <div className="flex items-center gap-0.5">
        {user.location?.city && (
          <>
            <span className="flex items-center gap-1">
              <House className="size-4" /> {user.location.city}
            </span>
            <Dot />
          </>
        )}

        <span>
          Joined{" "}
          {user?.createdAt.toLocaleDateString("en-US", { month: "short" })}{" "}
          &apos;
          {user?.createdAt.toLocaleDateString("en-US", { year: "2-digit" })}
        </span>
      </div>

      {user?.instagramHandle ? (
        <Button variant={"outline"} asChild>
          <Link
            href={`https://instagram.com/${user.instagramHandle}`}
            target="_blank"
          >
            <Instagram /> {user.instagramHandle}
          </Link>
        </Button>
      ) : user?.id === currentUserId ? (
        <Button variant={"outline"} asChild>
          <Link href="/profile">
            <Instagram /> Add instagram
          </Link>
        </Button>
      ) : user?.id === currentUserId ? (
        <Button variant={"outline"} asChild>
          <Link href="/profile">
            <Instagram /> Add instagram
          </Link>
        </Button>
      ) : null}
      {isOwnProfile ? (
        <div className="mb-4 flex justify-end gap-2">
          <Button variant={"outline"} asChild>
            <Link href={`/${userId}/edit`}>Edit Profile</Link>
          </Button>

          <ShareButton />
        </div>
      ) : (
        <FriendButton user={user} />
      )}
    </div>
  )
}

const FriendButton = async ({ user }: { user: User }) => {
  const currentUserId = await getCurrentUserId()

  if (!currentUserId) return <SignInToAddFriend targetUserId={user.id} />
  if (currentUserId === user.id) return null

  const isFriend = await userRepository.areFriends(currentUserId, user.id)

  if (isFriend) {
    return <RemoveFriendButton targetUserId={user.id} />
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-accent p-6">
      <div>{user.name} has invited you to be friends</div>
      <AddFriendButton targetUserId={user.id} />
    </div>
  )
}
