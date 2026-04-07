import { getCurrentUserId } from "@/lib/auth"

import { userRepository } from "@/lib/repositories/user-repository"

import Link from "next/link"

import { House, Instagram } from "lucide-react"
import { Button } from "./ui/button"

export const ProfileHeader = async ({ userId }: { userId: number }) => {
  const currentUserId = await getCurrentUserId()

  // get home city of current user
  const user = await userRepository.findById(userId)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="size-40 overflow-hidden rounded-full bg-accent">
        <img src={"https://picsum.photos/200"} alt="Profile picture" />
      </div>

      <div className="text-2xl font-bold">{user?.name}</div>
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <House /> {user?.homeCity}
      </span>

      {user?.instagramHandle ? (
        <Button variant={"outline"} asChild>
          <Link
            href={`https://instagram.com/${user.instagramHandle}`}
            target="_blank"
          >
            <Instagram /> {user.instagramHandle}
          </Link>
        </Button>
      ) : (
        <Button variant={"outline"} asChild>
          <Link href="/profile">
            <Instagram /> Add instagram
          </Link>
        </Button>
      )}
      {currentUserId === userId && (
        <Button variant={"outline"} asChild>
          <Link href={`/${userId}/edit`}>Edit</Link>
        </Button>
      )}
    </div>
  )
}
