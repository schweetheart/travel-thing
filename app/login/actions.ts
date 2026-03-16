"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { userRepository } from "@/lib/repositories/user-repository"

export async function setUserAction(formData: FormData) {
  const userId = parseInt(formData.get("userId") as string, 10)
  if (isNaN(userId) || userId < 1) return

  // upsert so that picking a non-existent id auto-creates the user
  await userRepository.upsert(userId)

  const cookieStore = await cookies()
  cookieStore.set("userId", String(userId), { path: "/" })
  redirect("/")
}
