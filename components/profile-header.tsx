import { getCurrentUserId } from "@/lib/auth"

import { userRepository } from "@/lib/repositories/user-repository"

import Link from "next/link"
import Image from "next/image"

import { Dot, House, Instagram } from "lucide-react"
import { Button } from "./ui/button"
import { FileUpload } from "./upload-image"
import { getUrl } from "@/lib/storage"

export const ProfileHeader = async ({ userId }: { userId: number }) => {
  const currentUserId = await getCurrentUserId()

  const user = await userRepository.findById(userId)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="relative size-40 overflow-hidden rounded-full bg-accent">
          {user?.profileImageKey && (
            <Image
              fill={true}
              objectFit="cover"
              sizes="230px"
              src={getUrl(user.profileImageKey)}
              alt={`${user?.name}'s profile picture`}
            />
          )}
        </div>
        <div className="absolute right-0 bottom-0">
          <FileUpload />
        </div>
      </div>

      <div className="text-2xl font-bold">{user?.name}</div>
      <div className="flex items-center gap-0.5">
        <span className="flex items-center gap-1">
          <House className="size-4" /> {user?.homeCity}
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
      ) : null}
      {currentUserId === userId && (
        <Button variant={"outline"} asChild>
          <Link href={`/${userId}/edit`}>Edit Profile</Link>
        </Button>
      )}

      {currentUserId === null && (
        <Button variant={"outline"} asChild>
          <Link href="/login">Log in to see more</Link>
        </Button>
      )}
    </div>
  )
}
