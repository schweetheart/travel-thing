import { Suspense, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home } from "lucide-react"
import { UserAvatar } from "@/components/user-nav"

type ProfileLayoutProps = {
  children: ReactNode
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <Button variant={"ghost"} size={"icon"} asChild>
          <Link href="/">
            <Home />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant={"outline"}>
            <Link href="/create">Create</Link>
          </Button>
          <Suspense
            fallback={<div className="size-8 rounded-full bg-accent" />}
          >
            <UserAvatar />
          </Suspense>
        </div>
      </div>
      {children}
    </>
  )
}
