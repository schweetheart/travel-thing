"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { addActivityToVisitAction } from "@/app/actions"
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
  onAdded,
}: {
  visitId: number
  onAdded?: (name: string) => void
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
    startTransition(async () => {
      const formData = new FormData()
      formData.set("visitId", String(visitId))
      formData.set("activityName", data.name)
      if (data.url) formData.set("activityUrl", data.url)

      onAdded?.(data.name)
      await addActivityToVisitAction(formData)
      reset()
      setIsOpen(false)
    })
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
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
