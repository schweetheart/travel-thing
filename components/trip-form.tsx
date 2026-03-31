"use client"

import { useState, useTransition } from "react"
import { createVisitAction, updateVisitAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldSet } from "@/components/ui/field"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

type Visit = { id: number; city: string; arriveAt: Date; departAt: Date }

export function TripForm({
  visit,
  trigger,
  onSubmitAction,
}: {
  visit?: Visit
  trigger?: React.ReactNode
  onSubmitAction?: (value: string) => void | Promise<void>
}) {
  const isEditing = !!visit
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [date, setDate] = useState<DateRange | undefined>(
    visit ? { from: visit.arriveAt, to: visit.departAt } : undefined
  )

  const action = (formData: FormData) => {
    setOpen(false)
    startTransition(async () => {
      await onSubmitAction?.("Hello world!")

      if (isEditing) {
        return await updateVisitAction(formData)
      }

      await createVisitAction(formData)
    })
  }

  const defaultTrigger = isEditing ? (
    <Button variant="outline">Edit</Button>
  ) : (
    <Button>Add Trip</Button>
  )

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger ?? defaultTrigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isEditing ? "Edit Trip" : "New Trip"}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <form action={action}>
            {isEditing && <input type="hidden" name="id" value={visit.id} />}
            <FieldSet>
              <Field>
                <Input
                  id="city"
                  name="city"
                  placeholder="Where to?"
                  disabled={isEditing}
                  defaultValue={visit?.city}
                  required
                />
              </Field>

              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="w-65 justify-start px-2.5 font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} –{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick arrival & departure</span>
                  )}
                </Button>
                <Calendar
                  disabled={{ before: new Date() }}
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
                <input
                  type="hidden"
                  name="arriveAt"
                  value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
                />
                <input
                  type="hidden"
                  name="departAt"
                  value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
                />
              </Field>

              <Button type="submit" className="mb-4" disabled={isPending}>
                {isPending
                  ? isEditing
                    ? "Saving..."
                    : "Adding..."
                  : isEditing
                    ? "Save"
                    : "Add Trip"}
              </Button>
            </FieldSet>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
