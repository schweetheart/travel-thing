import { cookies } from "next/headers"
import { cache } from "react"

const USER_ID_COOKIE = "userId"

export const getCurrentUserId = cache(async () => {
  const cookieStore = await cookies()
  const value = cookieStore.get(USER_ID_COOKIE)?.value
  if (!value) return null
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? null : parsed
})
