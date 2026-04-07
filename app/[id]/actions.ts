"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { redirect } from "next/navigation"
import { Route } from "next"

export async function updateProfileAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  const name = (formData.get("name") as string).trim()
  const homeCity = (formData.get("homeCity") as string).trim()
  const instagramHandle = (formData.get("instagramHandle") as string).trim()

  await userRepository.update(userId, { name, homeCity, instagramHandle })
  revalidatePath("/profile")
  redirect("/" as Route)
}
