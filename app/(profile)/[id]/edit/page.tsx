import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { updateProfileAction } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ChevronLeft, Instagram } from "lucide-react"
import { Route } from "next"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default async function ProfilePage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  const user = await userRepository.findById(userId)
  if (!user) redirect("/login")

  await setTimeout(() => {}, 1000) // Simulate loading state

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <div className="text-2xl font-bold">Edit Profile</div>
      <form action={updateProfileAction}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              defaultValue={user.name ?? ""}
              placeholder="Your name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="homeCity">Home City</FieldLabel>
            <Input
              id="homeCity"
              name="homeCity"
              defaultValue={user.homeCity ?? ""}
              placeholder="e.g. Seattle"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="instagramHandle">Instagram</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="instagramHandle"
                name="instagramHandle"
                defaultValue={user.instagramHandle ?? ""}
                placeholder="yourhandle"
              />
              <InputGroupAddon>
                <Instagram />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Button type="submit">Save</Button>
        </FieldGroup>
      </form>
    </div>
  )
}
