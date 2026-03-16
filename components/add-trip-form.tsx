"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { createVisitAction } from "@/app/actions"
import { Field, FieldLabel } from "./ui/field"

export function AddTripForm() {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined)

  return (
    <form
      action={createVisitAction}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <Field>
        <FieldLabel htmlFor="city">City</FieldLabel>
        <Input id="city" name="city" placeholder="e.g. London" required />
      </Field>

      <Field>
        <FieldLabel>Date Range</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
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
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
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

      <Button type="submit">Add</Button>
    </form>
  )
}
