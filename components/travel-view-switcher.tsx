"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Globe } from "lucide-react"
import { useCallback } from "react"

interface TravelViewSwitcherProps {
  allCount: number
  mutualCount: number
  currentView: "all" | "mutual"
}

export function TravelViewSwitcher({
  allCount,
  mutualCount,
  currentView,
}: TravelViewSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("view", value)
      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="flex gap-1 rounded-full bg-muted p-1">
      <Button
        variant={currentView === "all" ? "default" : "ghost"}
        size="sm"
        className="rounded-full"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={() =>
          router.push(`${pathname}?${createQueryString("all")}` as any)
        }
      >
        <Globe />
        All travel
        <span className="text-muted-foreground">{allCount}</span>
      </Button>
      <Button
        variant={currentView === "mutual" ? "default" : "ghost"}
        size="sm"
        className="rounded-full"
        onClick={() =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          router.push(`${pathname}?${createQueryString("mutual")}` as any)
        }
      >
        <Users />
        Mutual
        <span
          className={
            currentView === "mutual"
              ? "text-primary-foreground/60"
              : "text-muted-foreground"
          }
        >
          {mutualCount}
        </span>
      </Button>
    </div>
  )
}
