"use client"

import { useOptimistic, useTransition } from "react"
import { removeActivityFromVisitAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ExternalLink, Music, Trash } from "lucide-react"
import { ActivityForm } from "@/components/activity-form"

export type ActivityData = {
  name: string
  url?: string | null
}

type OptimisticAction =
  | { type: "add"; name: string }
  | { type: "remove"; name: string }

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
      if (action.type === "add") return [...state, { name: action.name }]
      return state.filter((a) => a.name !== action.name)
    }
  )

  function handleRemove(name: string) {
    startTransition(async () => {
      dispatchOptimistic({ type: "remove", name })
      await removeActivityFromVisitAction({ visitId, activityName: name })
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <ItemGroup>
        {activities.map((activity) => (
          <Item key={activity.name}>
            <ItemMedia variant="icon" />
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
            <ItemActions>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(activity.name)}
              >
                <Trash />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>

      {canEdit && (
        <ActivityForm
          visitId={visitId}
          onAdded={(name) => dispatchOptimistic({ type: "add", name })}
        />
      )}
    </div>
  )
}
