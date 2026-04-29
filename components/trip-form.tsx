"use client"

import { useTransition } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { createVisitAction, updateVisitAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
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
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { cn, formatDate } from "@/lib/utils"

export type Visit = {
  id: number
  city: string
  arriveAt: Date
  departAt: Date
  displayName?: string | null
}

type TripFormValues = {
  city: string
  displayName: string
  dateRange: DateRange | undefined
}

export function TripForm({ visit }: { visit?: Visit }) {
  const isEditing = !!visit
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TripFormValues>({
    defaultValues: {
      city: visit?.city ?? "",
      displayName: visit?.displayName ?? "",
      dateRange: visit
        ? { from: visit.arriveAt, to: visit.departAt }
        : undefined,
    },
  })

  const cityValue = useWatch({ control, name: "city" })

  const onSubmit = (data: TripFormValues) => {
    startTransition(async () => {
      if (isEditing) {
        await updateVisitAction({
          id: visit.id,
          arriveAt: data.dateRange?.from ?? new Date(),
          departAt: data.dateRange?.to ?? new Date(),
          displayName: data.displayName || null,
        })
        return
      }
      await createVisitAction({
        city: data.city,
        displayName: data.displayName || undefined,
        arriveAt: data.dateRange?.from ?? new Date(),
        departAt: data.dateRange?.to ?? new Date(),
      })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="displayName">What</FieldLabel>
          <Input
            placeholder={cityValue ? cityValue : "Display name (optional)"}
            {...register("displayName")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="city">Where</FieldLabel>
          <Input
            placeholder="Where"
            disabled={isEditing}
            {...register("city", { required: "City is required" })}
          />
          {errors.city && (
            <span className="text-sm text-destructive">
              {errors.city.message}
            </span>
          )}
        </Field>

        <Field>
          <Controller
            control={control}
            name="dateRange"
            rules={{
              validate: (v) =>
                v?.from && v?.to ? true : "Pick both arrival & departure dates",
            }}
            render={({ field }) => (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="secondary"
                    type="button"
                    className={cn(
                      "justify-start text-left",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, "LLL dd, y")} –{" "}
                          {format(field.value.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(field.value.from, "LLL dd, y")
                      )
                    ) : (
                      <span>When</span>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-lg">
                    <DrawerHeader>
                      <DrawerTitle>
                        {field.value === undefined ? (
                          "Select trip dates"
                        ) : (
                          <>
                            {field.value?.from && formatDate(field.value.from)}{" "}
                            {field.value?.to &&
                              `- ${formatDate(field.value.to)}`}
                          </>
                        )}
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="overflow-y-auto px-4">
                      <Calendar
                        disabled={{ before: new Date() }}
                        mode="range"
                        numberOfMonths={1}
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        className="w-full"
                      />
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button>Done</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
          />
          {errors.dateRange && (
            <span className="text-sm text-destructive">
              {errors.dateRange.message}
            </span>
          )}
        </Field>
      </FieldSet>

      <div className="mt-6">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? isEditing
              ? "Saving..."
              : "Adding..."
            : isEditing
              ? "Save"
              : "Share"}
        </Button>
      </div>
    </form>
  )
}
