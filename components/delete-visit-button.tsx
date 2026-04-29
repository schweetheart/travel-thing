"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { createVisitAction, deleteVisitAction } from "@/app/actions"
import { useAction } from "next-safe-action/hooks"

export function DeleteVisitButton({ visitId }: { visitId: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      className="w-full"
      onClick={() =>
        startTransition(async () => {
          await deleteVisitAction({ id: visitId })
        })
      }
    >
      {isPending ? <Loader2 className="animate-spin" /> : null}
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  )
}

export function CopyVisitButton({
  city,
  arriveAt,
  departAt,
  displayName,
}: {
  city: string
  arriveAt: Date
  departAt: Date
  displayName?: string | null
}) {
  const { isPending, execute } = useAction(createVisitAction)

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={isPending}
      onClick={async () =>
        await execute({
          city,
          arriveAt,
          departAt,
          displayName: displayName ?? undefined,
        })
      }
    >
      {isPending ? <Loader2 className="animate-spin" /> : null}
      Copy into new Visit
    </Button>
  )
}
