"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { userRepository } from "@/lib/repositories/user-repository"
import { deleteFile } from "@/lib/storage"
import { getCurrentUserId, logout } from "@/lib/auth"

export async function setUserAction(formData: FormData) {
  const userId = parseInt(formData.get("userId") as string, 10)
  if (isNaN(userId) || userId < 1) return

  // upsert so that picking a non-existent id auto-creates the user
  const user = await userRepository.upsert(userId)

  const cookieStore = await cookies()
  cookieStore.set("userId", String(userId), { path: "/" })

  if (user.name === null) {
    redirect(`/${user.id}/edit`)
  }
  redirect("/")
}

export async function logoutAction() {
  await logout()
  redirect("/login")
}

export async function deleteUserAction(formData: FormData) {
  const userId = parseInt(formData.get("userId") as string, 10)
  if (isNaN(userId)) return

  const user = await userRepository.delete(userId)

  // If the user has a profile picture set, delete it from storage
  if (user?.profileImageKey) {
    deleteFile(user.profileImageKey).catch((err) => {
      console.error("Failed to delete profile image:", err)
    })
  }

  // If the deleted user is currently logged in, log them out
  const currentUserId = await getCurrentUserId()
  if (currentUserId === userId) {
    await logout()
  }

  redirect("/login")
}
