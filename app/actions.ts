"use server"

import { revalidatePath } from "next/cache"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { userRepository } from "@/lib/repositories/user-repository"
import { redirect } from "next/navigation"
import { Route } from "next"
import { authAction } from "@/lib/safe-action"
import {
  addActivitySchema,
  createVisitSchema,
  deleteVisitSchema,
  friendActionSchema,
  removeActivitySchema,
  updateVisitSchema,
} from "@/lib/schema"

export const createVisitAction = authAction
  .inputSchema(createVisitSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { userId } = ctx
    const created = await visitRepository.create({ ...parsedInput, userId })
    revalidatePath("/")
    redirect(`/visit/${created.id}` as Route)
  })

export const updateVisitAction = authAction
  .inputSchema(updateVisitSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { userId } = ctx
    const { id, arriveAt, departAt, displayName } = parsedInput

    const visit = await visitRepository.findById(id)
    if (!visit || visit.userId !== userId) return

    await visitRepository.update(id, { arriveAt, departAt, displayName })
    revalidatePath("/")
    redirect(`/visit/${id}`)
  })

export const deleteVisitAction = authAction
  .inputSchema(deleteVisitSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { userId } = ctx
    const { id } = parsedInput

    const visit = await visitRepository.findById(id)

    if (!visit || visit.userId !== userId) return

    await visitRepository.delete(id)
    revalidatePath("/")
    redirect("/")
  })

export const addActivityToVisitAction = authAction
  .inputSchema(addActivitySchema)
  .action(async ({ ctx, parsedInput }) => {
    const { userId } = ctx
    const { visitId, activityName, activityUrl } = parsedInput

    const visit = await visitRepository.findById(visitId)
    if (!visit || visit.userId !== userId) return

    await visitRepository.addActivity(visitId, activityName, activityUrl)
    revalidatePath(`/visit/${visitId}`)
  })

export const removeActivityFromVisitAction = authAction
  .inputSchema(removeActivitySchema)
  .action(async ({ ctx, parsedInput }) => {
    const { userId } = ctx
    const { visitId, activityName } = parsedInput

    const visit = await visitRepository.findById(visitId)
    if (!visit || visit.userId !== userId) return

    await visitRepository.removeActivity(visitId, activityName)
    revalidatePath(`/visit/${visitId}`)
  })

export const addFriendAction = authAction
  .inputSchema(friendActionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { userId } = ctx
    const { targetUserId } = parsedInput
    if (userId === targetUserId) return

    await userRepository.addFriend(userId, targetUserId)
    revalidatePath(`/${targetUserId}`)
  })

export const removeFriendAction = authAction
  .inputSchema(friendActionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { userId } = ctx
    const { targetUserId } = parsedInput
    if (userId === targetUserId) return

    await userRepository.removeFriend(userId, targetUserId)
    revalidatePath(`/${targetUserId}`)
  })
