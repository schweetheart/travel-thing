import { getCurrentUserId } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table"
import { userRepository } from "@/lib/repositories/user-repository"
import { visitRepository } from "@/lib/repositories/visit-repository"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export const HomeCity = async () => {
  const userId = await getCurrentUserId()

  if (!userId) return null

  // get home city of current user
  const user = await userRepository.findById(userId)
  const homeCity = user?.homeCity ?? null
  const visitors = homeCity
    ? await visitRepository.findVisitorsByCity(homeCity, userId)
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {homeCity ? (
            <>My Home City: {homeCity}</>
          ) : (
            <>
              My Home City{" "}
              <Link
                href="/profile"
                className="text-sm font-normal text-muted-foreground underline underline-offset-4"
              >
                (set in profile)
              </Link>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!homeCity ? (
          <p className="text-sm text-muted-foreground">
            Set your home city in your profile to see who&apos;s visiting.
          </p>
        ) : visitors.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No friends heading to {homeCity} right now.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Friend</TableCell>
                <TableCell>Arrive</TableCell>
                <TableCell>Depart</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-medium">
                    {visit.user.name ?? `User #${visit.user.id}`}
                  </TableCell>
                  <TableCell>{formatDate(visit.arriveAt)}</TableCell>
                  <TableCell>{formatDate(visit.departAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
