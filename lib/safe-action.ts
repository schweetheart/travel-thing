import { createSafeActionClient } from "next-safe-action"
import { getCurrentUserId } from "@/lib/auth"

/**
 * Base action client — use for public/unauthenticated actions.
 */
export const action = createSafeActionClient()

/**
 * Auth-gated action client — injects `userId` into ctx.
 * Throw an error if the user is not authenticated.
 */
export const authAction = createSafeActionClient().use(async ({ next }) => {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error("Unauthorized")
  return next({ ctx: { userId } })
})
