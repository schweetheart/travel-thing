import { auth as clerkAuth } from "@clerk/nextjs/server"
import { cache } from "react"
import { userRepository } from "./repositories/user-repository"

import { createClerkClient } from "@clerk/nextjs/server"

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export const getCurrentUserId = cache(async () => {
  // Try and get the clerk userId from the cookie
  const auth = await clerkAuth()

  if (!auth.isAuthenticated) {
    return null
  }

  // Return our userId from clerk if it is set
  if (auth.sessionClaims.externalId) {
    return Number(auth.sessionClaims.externalId)
  }

  const user = await userRepository.upsertByClerkId(auth.userId)

  // Set the externalId in clerk to our internal userId so we can avoid this database call in future requests
  await setClerkExternalId(auth.userId, String(user.id))

  return user.id
})

/**
 * Sets our internal userId as the external ID in Clerk
 * so in future requests we can get the userId without a database call
 */
const setClerkExternalId = async (clerkId: string, userId: string) => {
  const params = {
    externalId: userId,
  }
  await clerkClient.users.updateUser(clerkId, params)
  return
}
