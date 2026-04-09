import { getCurrentUserId } from "@/lib/auth"

import { userRepository } from "@/lib/repositories/user-repository"

import Link from "next/link"

import { Dot, House, Instagram } from "lucide-react"
import { Button } from "./ui/button"
import { FileUpload } from "./upload-image"
import { ShareButton } from "./share-button"
import { AvatarContent } from "./user-avatar"
import { Avatar } from "./ui/avatar"

export const ProfileHeader = async ({ userId }: { userId: number }) => {
  const currentUserId = await getCurrentUserId()

  const user = await userRepository.findById(userId)

  if (!user) return null

  const isOwnProfile = currentUserId === userId

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="size-40">
          <AvatarContent user={user} size={200} />
        </Avatar>
        <div className="absolute right-0 bottom-0">
          <FileUpload />
        </div>
      </div>

      <div className="text-2xl font-bold">{user.name}</div>
      <div className="flex items-center gap-0.5">
        <span className="flex items-center gap-1">
          <House className="size-4" /> {user.homeCity}
        </span>
        <Dot />
        <span>
          Joined{" "}
          {user?.createdAt.toLocaleDateString("us-en", {
            month: "short",
            year: "2-digit",
          })}
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
      {isOwnProfile && (
        <div className="mb-4 flex justify-end gap-2">
          <Button variant={"outline"} asChild>
            <Link href={`/${userId}/edit`}>Edit Profile</Link>
          </Button>

          <ShareButton />
        </div>
      )}

      {currentUserId === null && (
        <Button variant={"outline"} asChild>
          <Link href="/login">Log in to see more</Link>
        </Button>
      )}
    </div>
  )
}
