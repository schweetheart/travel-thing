import { Inter, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Metadata, Viewport } from "next"
import { ClerkProvider } from "@clerk/nextjs"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const viewport: Viewport = {
  themeColor: "black",
}
export const metadata: Metadata = {
  title: {
    default: "Friend Map",
    template: `%s | Friend Map`,
  },
}

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
        <ClerkProvider>
          <ThemeProvider>
            <div className="mx-auto max-w-2xl">{children}</div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
