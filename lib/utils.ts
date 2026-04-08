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
    return `${startDay}, ${month} ${start.getDate()} - ${end.getDate()}`
  }

  return `${formatDate(start)} - ${formatDate(end)}`
}

export const getFirstName = (fullName: string) => {
  return fullName.split(" ")[0]
}
