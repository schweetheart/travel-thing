"use client"

import { useOptimistic, useTransition } from "react"
import { deleteActivityAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ExternalLink, Trash } from "lucide-react"
import { ActivityForm } from "@/components/activity-form"

export type ActivityData = {
  name: string
  url?: string | null
  id: number
}

type OptimisticAction =
  | { type: "add"; data: ActivityData }
  | { type: "remove"; id: number }

export function ActivityList({
  visitId,
  initialActivities,
  canEdit = false,
}: {
  visitId: number
  initialActivities: ActivityData[]
  canEdit?: boolean
}) {
  const [, startTransition] = useTransition()
  const [activities, dispatchOptimistic] = useOptimistic(
    initialActivities,
    (state, action: OptimisticAction) => {
      if (action.type === "add") return [...state, action.data]
      return state.filter((a) => a.id !== action.id)
    }
  )

  function handleRemove(id: number) {
    startTransition(async () => {
      dispatchOptimistic({
        type: "remove",
        id,
      })
      await deleteActivityAction({ activityId: id })
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <ItemGroup>
        {activities.map((activity) => (
          <Item key={activity.id} className="hover:bg-muted">
            <ItemContent>
              <ItemTitle>
                {activity.url ? (
                  <a
                    href={activity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    {activity.name}
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  activity.name
                )}
              </ItemTitle>
            </ItemContent>
            {canEdit && (
              <ItemActions>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(activity.id)}
                >
                  <Trash />
                </Button>
              </ItemActions>
            )}
          </Item>
        ))}
      </ItemGroup>

      {canEdit && (
        <div className="px-4">
          <ActivityForm
            visitId={visitId}
            setValueAction={(data) =>
              dispatchOptimistic({
                type: "add",
                data: {
                  ...data,
                  id: Math.floor(Math.random() * (1000 - 0)) + 0,
                },
              })
            }
          />
        </div>
      )}
    </div>
  )
}
