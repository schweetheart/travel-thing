"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { redirect } from "next/navigation"
import { Route } from "next"
import { z } from "zod"
import { getCloudflareContext } from "@opennextjs/cloudflare"

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

export const uploadProfileImage = async (data: FormData) => {
  const { file } = Object.fromEntries(data.entries())

  const IMAGE_SCHEMA = z
    .file()
    .mime(["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"])
    .max(25 * 1024 * 1024) // Max file size: 25MB

  IMAGE_SCHEMA.parse(file)

  const userId = await getCurrentUserId()
  if (!userId) return

  // Generate a random key for the image (UUID)
  const imageKey = crypto.randomUUID()
  const cloudflare = getCloudflareContext()

  try {
    // Upload image to R2 with the random key
    const object = await cloudflare.env.IMAGES_R2_BUCKET.put(imageKey, file)

    if (!object) {
      throw new Error("Failed to upload image to R2")
    }

    // Update the user's profileImageKey column in the database using the request context
    await userRepository.update(userId, { profileImageKey: imageKey })

    console.log("Uploaded image to R2:", object?.size, "Key:", imageKey)

    revalidatePath("/")
    revalidatePath(`/${userId}`)
  } catch (error) {
    console.error("Error uploading image:", error)
  }
}
