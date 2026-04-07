"use client"

import { useOptimistic, useRef, useTransition } from "react"
import {
  addActivityToVisitAction,
  removeActivityFromVisitAction,
} from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Trash } from "lucide-react"

type OptimisticAction =
  | { type: "add"; name: string }
  | { type: "remove"; name: string }

export function ActivityList({
  visitId,
  initialActivities,
  activityFriendMap = {},
}: {
  visitId: number
  initialActivities: string[]
  activityFriendMap?: Record<string, string[]>
}) {
  const [isPending, startTransition] = useTransition()
  const [activities, dispatchOptimistic] = useOptimistic(
    initialActivities,
    (state, action: OptimisticAction) => {
      if (action.type === "add") return [...state, action.name]
      return state.filter((a) => a !== action.name)
    }
  )
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd() {
    const name = inputRef.current?.value.trim()
    if (!name) return

    const formData = new FormData()
    formData.set("visitId", String(visitId))
    formData.set("activityName", name)

    if (inputRef.current) inputRef.current.value = ""

    startTransition(async () => {
      dispatchOptimistic({ type: "add", name })
      await addActivityToVisitAction(formData)
    })
  }

  function handleRemove(name: string) {
    const formData = new FormData()
    formData.set("visitId", String(visitId))
    formData.set("activityName", name)

    startTransition(async () => {
      dispatchOptimistic({ type: "remove", name })
      await removeActivityFromVisitAction(formData)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {activities.length > 0 && (
        <ItemGroup>
          {activities.map((name) => (
            <Item key={name} variant={"outline"}>
              <ItemContent>
                <ItemTitle>{name}</ItemTitle>
                {activityFriendMap[name] && (
                  <ItemDescription>
                    {activityFriendMap[name].join(", ")}
                  </ItemDescription>
                )}
              </ItemContent>
              <ItemActions>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(name)}
                >
                  <Trash />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      )}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="Add an activity"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAdd()
            }
          }}
        />
        <Button type="button" variant="outline" onClick={handleAdd}>
          Add
        </Button>
      </div>
    </div>
  )
}
