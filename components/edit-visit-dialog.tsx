"use client"

import { useState } from "react"
import { updateVisitAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function toInputDate(d: Date) {
  return new Date(d).toISOString().split("T")[0]
}

export function EditVisitDialog({
  visit,
}: {
  visit: { id: number; city: string; arriveAt: Date; departAt: Date }
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await updateVisitAction(formData)
            setOpen(false)
          }}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="id" value={visit.id} />
          <div className="space-y-2">
            <Label htmlFor="edit-city">City</Label>
            <Input
              id="edit-city"
              name="city"
              defaultValue={visit.city}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-arrive">Arrive</Label>
            <Input
              id="edit-arrive"
              name="arriveAt"
              type="date"
              defaultValue={toInputDate(visit.arriveAt)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-depart">Depart</Label>
            <Input
              id="edit-depart"
              name="departAt"
              type="date"
              defaultValue={toInputDate(visit.departAt)}
              required
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
