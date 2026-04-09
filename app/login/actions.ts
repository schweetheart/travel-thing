"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { userRepository } from "@/lib/repositories/user-repository"
import { Route } from "next"

export async function setUserAction(formData: FormData) {
  const userId = parseInt(formData.get("userId") as string, 10)
  if (isNaN(userId) || userId < 1) return

  // upsert so that picking a non-existent id auto-creates the user
  await userRepository.upsert(userId)

  const cookieStore = await cookies()
  cookieStore.set("userId", String(userId), { path: "/" })
  redirect("/" as Route)
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("userId")
  redirect("/login")
}

export async function deleteUserAction(formData: FormData) {
  const userId = parseInt(formData.get("userId") as string, 10)
  if (isNaN(userId)) return

  await userRepository.delete(userId)

  // If the deleted user is currently logged in, log them out
  const cookieStore = await cookies()
  const currentId = parseInt(cookieStore.get("userId")?.value ?? "", 10)
  if (currentId === userId) {
    cookieStore.delete("userId")
  }

  redirect("/login")
}
