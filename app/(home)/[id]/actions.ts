"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { redirect } from "next/navigation"
import { z } from "zod"
import { deleteFile, uploadFile } from "@/lib/storage"
import { MIME_TYPES } from "@/lib/consts"

export async function updateProfileAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  const name = (formData.get("name") as string).trim()
  const homeCity = (formData.get("homeCity") as string).trim()
  const instagramHandle = (formData.get("instagramHandle") as string).trim()

  await userRepository.update(userId, {
    name,
    location: {
      connectOrCreate: {
        where: { city: homeCity },
        create: { city: homeCity },
      },
    },
    instagramHandle,
  })
  revalidatePath("/profile")
  redirect("/")
}

export const uploadProfileImage = async (data: FormData) => {
  const { file } = Object.fromEntries(data.entries())

  const IMAGE_SCHEMA = z
    .file()
    .mime(MIME_TYPES)
    .max(25 * 1024 * 1024) // Max file size: 25MB

  const validatedFile = IMAGE_SCHEMA.parse(file)

  const userId = await getCurrentUserId()
  if (!userId) return

  // Generate a random key for the image (UUID)
  const imageKey = crypto.randomUUID()

  try {
    // Upload image to R2 with the random key
    await uploadFile(imageKey, validatedFile)

    // Delete the old profile image from R2 if it exists
    const user = await userRepository.findById(userId)
    if (user?.profileImageKey) {
      await deleteFile(user.profileImageKey)
    }

    // Update the user's profileImageKey column in the database using the request context
    await userRepository.update(userId, { profileImageKey: imageKey })

    console.log("Uploaded image to R2:", validatedFile.size, "Key:", imageKey)

    revalidatePath("/")
    revalidatePath(`/${userId}`)
  } catch (error) {
    console.error("Error uploading image:", error)
  }
}
