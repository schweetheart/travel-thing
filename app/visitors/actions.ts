"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { z } from "zod"

export async function setHomeCityAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  const schema = z.object({
    homeCity: z.string().min(1, "City is required"),
  })

  const { homeCity } = schema.parse({
    homeCity: formData.get("homeCity"),
  })

  await userRepository.update(userId, { homeCity })
  revalidatePath("/visitors")
}
