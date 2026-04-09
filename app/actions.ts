"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { redirect } from "next/navigation"
import { Route } from "next"
import z from "zod"

export async function createVisitAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  // validate with zod
  const createVisitSchema = z.object({
    city: z.string().min(1, "City is required"),
    arriveAt: z.coerce.date(),
    departAt: z.coerce.date(),
    displayName: z.string().optional(),
  })

  const validated = createVisitSchema.parse({
    city: formData.get("city"),
    arriveAt: formData.get("arriveAt"),
    departAt: formData.get("departAt"),
    displayName: formData.get("displayName"),
  })

  const created = await visitRepository.create({ ...validated, userId })
  revalidatePath("/")
  redirect(`/visit/${created.id}` as Route)
}

export async function updateVisitAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  const id = parseInt(formData.get("id") as string, 10)
  // const city = (formData.get("city") as string).trim()
  const arriveAt = new Date(formData.get("arriveAt") as string)
  const departAt = new Date(formData.get("departAt") as string)
  const displayName =
    ((formData.get("displayName") as string) ?? "").trim() || null

  if (!id || isNaN(arriveAt.getTime()) || isNaN(departAt.getTime())) return

  // verify ownership
  const visit = await visitRepository.findById(id)
  if (!visit || visit.userId !== userId) return

  await visitRepository.update(id, {
    arriveAt,
    departAt,
    displayName,
  })
  revalidatePath("/")
  redirect(`/visit/${id}` as Route)
}

export async function deleteVisitAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  const id = parseInt(formData.get("id") as string, 10)
  if (!id) return

  const visit = await visitRepository.findById(id)
  if (!visit || visit.userId !== userId) return

  await visitRepository.delete(id)
  revalidatePath("/")

  redirect("/" as Route)
}

export async function addActivityToVisitAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  const visitId = parseInt(formData.get("visitId") as string, 10)
  const activityName = (formData.get("activityName") as string).trim()
  const activityUrl =
    ((formData.get("activityUrl") as string) ?? "").trim() || undefined
  if (!visitId || !activityName) return

  const visit = await visitRepository.findById(visitId)
  if (!visit || visit.userId !== userId) return

  await visitRepository.addActivity(visitId, activityName, activityUrl)
  revalidatePath(`/visit/${visitId}`)
}

export async function removeActivityFromVisitAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  const visitId = parseInt(formData.get("visitId") as string, 10)
  const activityName = (formData.get("activityName") as string).trim()
  if (!visitId || !activityName) return

  const visit = await visitRepository.findById(visitId)
  if (!visit || visit.userId !== userId) return

  await visitRepository.removeActivity(visitId, activityName)
  revalidatePath(`/visit/${visitId}`)
}
