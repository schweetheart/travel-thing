import { deleteVisitAction } from "@/app/actions"
import { getCurrentUserId } from "@/lib/auth"
import { EditVisitDialog } from "./edit-visit-dialog"
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "./ui/card"
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/table"
import { formatDate } from "@/lib/utils"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { getOverlappingCounts } from "./trips-count-util"
import { Button } from "./ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { AddTripForm } from "./add-trip-form"

export const Trips = async () => {
  const userId = await getCurrentUserId()
  if (!userId) return null
  const visits = await visitRepository.findByUser(userId)
  const counts = await getOverlappingCounts(visits, userId)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming &amp; Past Trips</CardTitle>
        <CardAction>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">
                <Plus /> Add
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <AddTripForm />
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent>
        {visits.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No trips yet. Add one above!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead>Friends There</TableHead>
                <TableHead>Arrive</TableHead>
                <TableHead>Depart</TableHead>
                <TableHead className="w-36" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/visit/${visit.id}`}
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {visit.city}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {counts[visit.id] > 0 ? counts[visit.id] : "-"}
                  </TableCell>
                  <TableCell>{formatDate(visit.arriveAt)}</TableCell>
                  <TableCell>{formatDate(visit.departAt)}</TableCell>
                  <TableCell className="flex gap-1">
                    <EditVisitDialog visit={visit} />
                    <form action={deleteVisitAction}>
                      <input type="hidden" name="id" value={visit.id} />
                      <Button variant="destructive" size="sm" type="submit">
                        Delete
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
