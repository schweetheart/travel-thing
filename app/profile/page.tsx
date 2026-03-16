import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"
import { userRepository } from "@/lib/repositories/user-repository"
import { updateProfileAction } from "./actions"
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

export default async function ProfilePage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  const user = await userRepository.findById(userId)
  if (!user) redirect("/login")

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Info</CardTitle>
          <CardDescription>User #{user.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfileAction} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeCity">Home City</Label>
              <Input
                id="homeCity"
                name="homeCity"
                defaultValue={user.homeCity}
                placeholder="e.g. Seattle"
              />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
