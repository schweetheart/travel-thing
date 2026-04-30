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

export const createVisitSchema = z.object({
  city: z.string().min(1, "City is required"),
  arriveAt: z.coerce.date(),
  departAt: z.coerce.date(),
  displayName: z.string().optional(),
})

export type CreateVisitInput = z.input<typeof createVisitSchema>

export const updateVisitSchema = z.object({
  id: z.number().int().positive(),
  arriveAt: z.coerce.date(),
  departAt: z.coerce.date(),
  displayName: z.string().optional().nullable(),
})

export type UpdateVisitInput = z.input<typeof updateVisitSchema>

export const deleteVisitSchema = z.object({
  id: z.number().int().positive(),
})

export const createActivitySchema = z.object({
  visitId: z.number().int().positive(),
  name: z.string().min(1),
  url: z.url().optional(),
})

export type CreateActivityInput = z.input<typeof createActivitySchema>

export const deleteActivitySchema = z.object({
  activityId: z.number().int().positive(),
})

export type DeleteActivityInput = z.input<typeof deleteActivitySchema>

export const friendActionSchema = z.object({
  targetUserId: z.number().int().positive(),
})
