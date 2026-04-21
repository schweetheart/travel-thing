import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function formatDateRange(start: Date, end: Date) {
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()

  if (sameMonth) {
    const startDay = start.toLocaleDateString("en-US", { weekday: "short" })
    const month = start.toLocaleDateString("en-US", { month: "short" })
    return `${month} ${start.getDate()} - ${end.getDate()}`
  }

  return `${formatDate(start)} - ${formatDate(end)}`
}

export const getFirstName = (fullName: string) => {
  return fullName.split(" ")[0]
}

export const getInitials = (fullName?: string | null, maxChars = 2) => {
  if (!fullName || typeof fullName !== "string") return ""

  const parts = fullName.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return ""

  if (parts.length === 1) {
    // Single name: take first letter (or more if maxChars>1)
    return parts[0].slice(0, maxChars).toUpperCase()
  }

  // Multi-part name: take first letter of first and last parts up to maxChars
  const first = parts[0][0] || ""
  const last = parts[parts.length - 1][0] || ""
  const initials = (first + last).slice(0, maxChars)

  return initials.toUpperCase()
}
