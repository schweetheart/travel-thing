"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, X } from "lucide-react"
import { inputStyles } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Route } from "next"

type FeedFiltersProps = {
  locations: { id: number; city: string }[]
  friends: { id: number; name: string | null }[]
  homeCity: string | null
}

export function FeedFilters({
  locations,
  friends,
  homeCity,
}: FeedFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      return params.toString()
    },
    [searchParams]
  )

  const updateFilter = (updates: Record<string, string | null>) => {
    startTransition(() => {
      const qs = createQueryString(updates)
      router.push(`${pathname}${qs ? `?${qs}` : ""}` as Route)
    })
  }

  const hasFilters =
    searchParams.has("city") ||
    searchParams.has("friendId") ||
    searchParams.has("arriveAfter") ||
    searchParams.has("departBefore")

  return (
    <div
      className={cn(
        "flex flex-col gap-3 transition-opacity",
        isPending && "opacity-60"
      )}
    >
      {homeCity && (
        <Button
          variant={
            searchParams.get("city") === homeCity ? "secondary" : "outline"
          }
          size="sm"
          onClick={() =>
            updateFilter({
              city: searchParams.get("city") === homeCity ? null : homeCity,
            })
          }
        >
          <Home className="size-3" />
          {homeCity}
        </Button>
      )}

      <div className="flex flex-wrap gap-2">
        <select
          className={cn(inputStyles, "w-auto min-w-32 appearance-none")}
          value={searchParams.get("city") ?? ""}
          onChange={(e) => updateFilter({ city: e.target.value || null })}
        >
          <option value="">All cities</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.city}>
              {loc.city}
            </option>
          ))}
        </select>

        <select
          className={cn(inputStyles, "w-auto min-w-32 appearance-none")}
          value={searchParams.get("friendId") ?? ""}
          onChange={(e) => updateFilter({ friendId: e.target.value || null })}
        >
          <option value="">All friends</option>
          {friends.map((f) => (
            <option key={f.id} value={String(f.id)}>
              {f.name ?? `User ${f.id}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Arrives after</label>
          <Input
            type="date"
            className="w-auto"
            value={searchParams.get("arriveAfter") ?? ""}
            onChange={(e) =>
              updateFilter({ arriveAfter: e.target.value || null })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">
            Departs before
          </label>
          <Input
            type="date"
            className="w-auto"
            value={searchParams.get("departBefore") ?? ""}
            onChange={(e) =>
              updateFilter({ departBefore: e.target.value || null })
            }
          />
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              updateFilter({
                city: null,
                friendId: null,
                arriveAfter: null,
                departBefore: null,
              })
            }
          >
            <X className="size-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
