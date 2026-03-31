"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"

export async function createVisitAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  const city = (formData.get("city") as string).trim()
  const arriveAt = new Date(formData.get("arriveAt") as string)
  const departAt = new Date(formData.get("departAt") as string)

  if (!city || isNaN(arriveAt.getTime()) || isNaN(departAt.getTime())) return

  await visitRepository.create({ city, arriveAt, departAt, userId })
  revalidatePath("/")
}

export async function updateVisitAction(formData: FormData) {
  const userId = await getCurrentUserId()
  if (!userId) return

  const id = parseInt(formData.get("id") as string, 10)
  // const city = (formData.get("city") as string).trim()
  const arriveAt = new Date(formData.get("arriveAt") as string)
  const departAt = new Date(formData.get("departAt") as string)

  if (!id || isNaN(arriveAt.getTime()) || isNaN(departAt.getTime())) return

  // verify ownership
  const visit = await visitRepository.findById(id)
  if (!visit || visit.userId !== userId) return

  await visitRepository.update(id, { arriveAt, departAt })
  revalidatePath("/")
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
}
