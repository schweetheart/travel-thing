"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus } from "lucide-react"
import { addFriendAction, removeFriendAction } from "@/app/actions"

export function AddFriendButton({ targetUserId }: { targetUserId: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => addFriendAction(targetUserId))}
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
      onClick={() => startTransition(() => removeFriendAction(targetUserId))}
    >
      <UserMinus />
      {isPending ? "Removing..." : "Remove Friend"}
    </Button>
  )
}
