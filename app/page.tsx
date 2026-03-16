import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"

import { AddTripForm } from "@/components/add-trip-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { HomeCity } from "@/components/home-city"
import { Suspense } from "react"
import { Trips } from "@/components/trips"
import { Skeleton } from "@/components/ui/skeleton"

export default async function HomePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile">Profile</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Switch User</Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <HomeCity />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton />}>
        <Trips />
      </Suspense>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-1/3 rounded" />
    <Skeleton className="h-4 w-full rounded" />
    <Skeleton className="h-4 w-full rounded" />
    <Skeleton className="h-4 w-full rounded" />
  </div>
)
