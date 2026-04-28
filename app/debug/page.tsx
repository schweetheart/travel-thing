import { userRepository } from "@/lib/repositories/user-repository"
import { getCurrentUserId } from "@/lib/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

export default async function LoginPage() {
  const currentUserId = await getCurrentUserId()

  const users = await userRepository.findAll()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Debug</h1>

      <Card>
        <CardHeader>
          <CardTitle>Set Active User</CardTitle>
          <CardDescription>
            Enter a user ID to log in as. If the user doesn&apos;t exist, one
            will be created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentUserId && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Currently logged in as user <strong>{currentUserId}</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">ID</TableHead>
            <TableHead className="w-40">Clerk ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Home City</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="group">
              <TableCell className="font-mono">
                <Link href={`/${user.id}`}>{user.id}</Link>
              </TableCell>
              <TableCell>{user.clerkId || "—"}</TableCell>
              <TableCell>{user.name || "—"}</TableCell>
              <TableCell>{user.location?.city || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
