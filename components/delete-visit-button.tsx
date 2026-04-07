"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function DeleteVisitButton() {
  const { pending } = useFormStatus()

  return (
    <Button variant="destructive" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : null}
      {pending ? "Deleting..." : "Delete"}
    </Button>
  )
}
