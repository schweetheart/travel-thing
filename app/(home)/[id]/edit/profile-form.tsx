"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { User } from "@/lib/repositories/user-repository"
import { updateProfileSchema, UpdateProfileInput } from "@/lib/schema"
import { updateProfileAction } from "../actions"
import { Instagram } from "lucide-react"

export const ProfileForm = ({ user }: { user: User }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      homeCity: user.location?.city ?? "",
      instagramHandle: user.instagramHandle ?? "",
    },
  })

  const { execute, isExecuting } = useAction(updateProfileAction)

  return (
    <form onSubmit={handleSubmit((data) => execute(data))}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" placeholder="Your name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="homeCity">Home City</FieldLabel>
          <Input
            id="homeCity"
            placeholder="e.g. Seattle"
            {...register("homeCity")}
          />
          {errors.homeCity && (
            <p className="text-sm text-destructive">
              {errors.homeCity.message}
            </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="instagramHandle">Instagram</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="instagramHandle"
              placeholder="yourhandle"
              {...register("instagramHandle")}
            />
            <InputGroupAddon>
              <Instagram />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? "Saving..." : "Save"}
        </Button>
      </FieldGroup>
    </form>
  )
}
