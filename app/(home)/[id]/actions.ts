"use server"

import { revalidatePath } from "next/cache"
import { userRepository } from "@/lib/repositories/user-repository"
import { redirect } from "next/navigation"
import { deleteFile, uploadFile } from "@/lib/storage"
import { authAction } from "@/lib/safe-action"
import { imageUploadSchema, updateProfileSchema } from "@/lib/schema"

export const updateProfileAction = authAction
  .inputSchema(updateProfileSchema)
  .action(async ({ ctx, parsedInput }) => {
    const userId = ctx.userId
    const { name, homeCity, instagramHandle } = parsedInput
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
    revalidatePath(`/${userId}`)
    redirect(`/${userId}`)
  })

export const uploadProfileImage = authAction
  .inputSchema(imageUploadSchema)
  .action(async ({ ctx, parsedInput }) => {
    const file = parsedInput
    const { userId } = ctx
    const imageKey = crypto.randomUUID()

    const deleteOldImage = (async () => {
      const user = await userRepository.findById(userId)
      if (user?.profileImageKey) {
        await deleteFile(user.profileImageKey)
      }
    })()

    await Promise.all([
      uploadFile(imageKey, file),
      userRepository.update(userId, { profileImageKey: imageKey }),
      deleteOldImage,
    ])

    revalidatePath(`/${userId}`)
  })
