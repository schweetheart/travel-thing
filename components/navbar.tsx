import Link from "next/link"
import { Button } from "./ui/button"
import { LogOut, Plane } from "lucide-react"
import { Suspense } from "react"
import { UserAvatar } from "./user-nav"
import { getCurrentUserId } from "@/lib/auth"
import { logoutAction } from "@/app/login/actions"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

export const Navbar = async () => {
  const isSignedIn = Boolean(await getCurrentUserId())

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-1 text-lg font-extrabold">
        <Plane />
        Trippy
      </div>
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
        <Button asChild variant={"outline"}>
          <Link href="/create">
            <Plus />
            Create
          </Link>
        </Button> */}
        {isSignedIn ? (
          <>
            <Drawer>
              <DrawerTrigger>
                <Suspense fallback={<div>Loading</div>}>
                  <UserAvatar />
                </Suspense>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="sr-only">
                  <DrawerTitle>Manage Account</DrawerTitle>
                </DrawerHeader>

                <form action={logoutAction}>
                  <Button variant={"destructive"} className="w-full">
                    <LogOut /> Logout
                  </Button>
                </form>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Button variant={"secondary"} asChild>
            <Link href="/login">Log in</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
