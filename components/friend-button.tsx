"use client"

import { useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus } from "lucide-react"
import { addFriendAction, removeFriendAction } from "@/app/actions"
import { SignInButton } from "@clerk/nextjs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { Route } from "next"

export function AddFriendButton({ targetUserId }: { targetUserId: number }) {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("addFriend") === String(targetUserId)) {
      startTransition(async () => {
        await addFriendAction({ targetUserId })
        router.replace(window.location.pathname as Route)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(async () => { await addFriendAction({ targetUserId }) })}
    >
      <UserPlus />
      {isPending ? "Adding..." : "Add Friend"}
    </Button>
  )
}

export function RemoveFriendButton({ targetUserId }: { targetUserId: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(async () => { await removeFriendAction({ targetUserId }) })}
    >
      <UserMinus />
      {isPending ? "Removing..." : "Remove Friend"}
    </Button>
  )
}

export function SignInToAddFriend({ targetUserId }: { targetUserId: number }) {
  const pathname = usePathname()

  return (
    <SignInButton
      mode="modal"
      forceRedirectUrl={`${pathname}?addFriend=${targetUserId}`}
    >
      <Button variant="outline">
        <UserPlus />
        Add Friend
      </Button>
    </SignInButton>
  )
}
