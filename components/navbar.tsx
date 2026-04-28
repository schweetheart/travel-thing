import Link from "next/link"
import { Button } from "./ui/button"
import { Plane, Plus } from "lucide-react"
import { Suspense } from "react"
import { UserAvatar } from "./user-nav"
import { getCurrentUserId } from "@/lib/auth"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"
import { SignInButton, SignOutButton } from "@clerk/nextjs"

export const Navbar = async () => {
  const userId = await getCurrentUserId()
  const isSignedIn = Boolean(userId)

  return (
    <div className="flex items-center justify-between p-4">
      <Link href="/" className="flex items-center gap-1 text-lg font-extrabold">
        <Plane />
        Trippy
      </Link>
      {/*       <Button variant={"ghost"} size={"icon"} asChild>
        <Link href="/feed">
          <Home />
        </Link>
      </Button> */}
      <div className="flex items-center gap-2">
        {/*  <Button asChild variant={"link"}>
          <Link href="/visitors">Visitors</Link>
        </Button>
        <Button asChild variant={"link"}>
          <Link href="/friends">Friends</Link>
        </Button>
        */}

        {isSignedIn ? (
          <>
            <Button asChild variant={"link"}>
              <Link href="/friends">Friends</Link>
            </Button>
            <Button asChild variant={"secondary"} size={"sm"}>
              <Link href="/create">
                <Plus />
                New
              </Link>
            </Button>
            <Drawer>
              <DrawerTrigger>
                <Suspense
                  fallback={<div className="size-8 rounded-full bg-accent" />}
                >
                  <UserAvatar />
                </Suspense>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="sr-only">
                  <DrawerTitle>Manage Account</DrawerTitle>
                </DrawerHeader>

                <div className="flex flex-col gap-2 pt-2">
                  <DrawerClose asChild>
                    <Button variant={"outline"} asChild className="w-full">
                      <Link href={`/${userId}`}>Profile</Link>
                    </Button>
                  </DrawerClose>

                  <SignOutButton />
                </div>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Button asChild variant={"outline"}>
            <SignInButton>Log in</SignInButton>
          </Button>
        )}
      </div>
    </div>
  )
}
