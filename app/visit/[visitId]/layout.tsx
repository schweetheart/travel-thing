"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className={"p-4"}>
        <BackButton />
      </div>
      {children}
    </>
  )
}

export const BackButton = () => {
  const pathName = usePathname()

  // Default to the homepage
  const [backUrl, setBackUrl] = useState("/")

  useEffect(() => {
    const referrer = document.referrer

    console.log("Referrer:", referrer)

    // Check if referrer exists and belongs to your domain
    if (referrer && referrer.includes(window.location.origin)) {
      // is it referreing to the same page as it ucrrent is on? if so, we should not set the back url to the referrer, but to the homepage
      if (referrer === window.location.href) {
        return setBackUrl("/")
      }
      setBackUrl(referrer)
    }
  }, [pathName])

  return (
    <Button asChild variant={"ghost"} size={"icon"}>
      <Link href={backUrl as Route}>
        <ArrowLeft />
      </Link>
    </Button>
  )
}
