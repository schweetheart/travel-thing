"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { createActivityAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus } from "lucide-react"

type ActivityFormValues = {
  name: string
  url: string
}

export function ActivityForm({
  visitId,
  setValueAction,
}: {
  visitId: number
  setValueAction?: ({
    name,
    url,
  }: {
    name: string
    url?: string | null
  }) => void
}) {
  const [isPending, startTransition] = useTransition()

  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    defaultValues: {
      name: "",
      url: "",
    },
  })

  const onSubmit = (data: ActivityFormValues) => {
    setIsOpen(false)
    reset()

    startTransition(async () => {
      setValueAction?.(data)
      createActivityAction({
        visitId,
        name: data.name,
        url: data.url || undefined,
      })
    })
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus />
            Accommodation
          </Button>

          <Button variant="outline">
            <Plus />
            Link
          </Button>
          <Button variant="outline">
            <Plus />
            Event
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Add an activity</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="px-4">
            <FieldSet>
              <Field>
                <FieldLabel htmlFor="name">Activity name</FieldLabel>
                <Input
                  placeholder="e.g. Hiking, Museum, Restaurant"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <span className="text-sm text-destructive">
                    {errors.name.message}
                  </span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="url">Link (optional)</FieldLabel>
                <Input
                  placeholder="https://..."
                  type="url"
                  {...register("url")}
                />
              </Field>
            </FieldSet>
            <DrawerFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
