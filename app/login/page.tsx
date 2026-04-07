import { userRepository } from "@/lib/repositories/user-repository"
import { getCurrentUserId } from "@/lib/auth"
import { setUserAction, logoutAction } from "./actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function LoginPage() {
  const users = await userRepository.findAll()
  const currentUserId = await getCurrentUserId()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Debug Login</h1>

      <Card>
        <CardHeader>
          <CardTitle>Set Active User</CardTitle>
          <CardDescription>
            Enter a user ID to log in as. If the user doesn&apos;t exist, one
            will be created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={setUserAction} className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                name="userId"
                type="number"
                min={1}
                placeholder="e.g. 1"
                required
              />
            </div>
            <Button type="submit">Set User</Button>
          </form>
          {currentUserId && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Currently logged in as user <strong>{currentUserId}</strong>
              </p>
              <form action={logoutAction}>
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No users yet. Set a user ID above to create one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Home City</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="group">
                    <TableCell className="font-mono">{user.id}</TableCell>
                    <TableCell>{user.name || "—"}</TableCell>
                    <TableCell>{user.homeCity || "—"}</TableCell>
                    <TableCell>
                      {user.id === currentUserId ? (
                        <Badge className="border border-solid border-green-100 bg-green-100 text-green-600">
                          Active
                        </Badge>
                      ) : (
                        <form action={setUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <Button variant="link" size="sm" type="submit">
                            Switch
                          </Button>
                        </form>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
