import { getCurrentUserId } from "@/lib/auth"

import { userRepository } from "@/lib/repositories/user-repository"

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

export const ProfileHeader = async ({ userId }: { userId: number }) => {
  const currentUserId = await getCurrentUserId()

  const user = await userRepository.findById(userId)

  if (!user) return null

  const isOwnProfile = currentUserId === userId

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="size-40">
          <AvatarContent user={user} size={160} />
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
        <FriendButton userId={userId} />
      )}
    </div>
  )
}

const FriendButton = async ({ userId }: { userId: number }) => {
  const currentUserId = await getCurrentUserId()

  if (!currentUserId) return <SignInToAddFriend targetUserId={userId} />
  if (currentUserId === userId) return null

  const isFriend = await userRepository.areFriends(currentUserId, userId)

  if (isFriend) {
    return <RemoveFriendButton targetUserId={userId} />
  }

  return <AddFriendButton targetUserId={userId} />
}
