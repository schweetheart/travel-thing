"use client"

import { useTransition } from "react"
import { setHomeCityAction } from "@/app/visitors/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

export function SetHomeCityForm() {
  const [isPending, startTransition] = useTransition()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        startTransition(() => setHomeCityAction(formData))
      }}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="homeCity">Your home city</FieldLabel>
        <Input
          id="homeCity"
          name="homeCity"
          placeholder="e.g. New York"
          required
        />
      </Field>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Set home city"}
      </Button>
    </form>
  )
}
