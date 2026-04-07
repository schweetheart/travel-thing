import { Inter, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-nav"
import { Suspense } from "react"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body className="touch-pan-y">
        <ThemeProvider>
          <div className="flex items-center justify-between bg-accent p-4">
            <Link href="/" className="font-bold">
              Home
            </Link>
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
        </ThemeProvider>
      </body>
    </html>
  )
}
