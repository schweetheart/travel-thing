import { z } from "zod"
import { MIME_TYPES } from "./consts"

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  homeCity: z.string().min(1, "Home city is required"),
  instagramHandle: z
    .string()
    .nullish()
    .transform((val) => (val === "" ? null : val)),
})

export type UpdateProfileInput = z.input<typeof updateProfileSchema>

export const imageUploadSchema = z
  .file()
  .mime(MIME_TYPES)
  .max(25 * 1024 * 1024) // Max file size: 25MB
