import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/auth"
import { visitRepository } from "@/lib/repositories/visit-repository"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ visitId: string }>
}) {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/login")

  const { visitId } = await params
  const id = parseInt(visitId, 10)
  if (isNaN(id)) notFound()

  const visit = await visitRepository.findById(id)
  if (!visit) notFound()

  const overlapping = await visitRepository.findOverlapping(
    visit.city,
    visit.arriveAt,
    visit.departAt,
    visit.userId
  )

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold">Trip to {visit.city}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{visit.city}</CardTitle>
          <CardDescription>
            {formatDate(visit.arriveAt)} — {formatDate(visit.departAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Booked by user{" "}
          <strong>{visit.user.name || `#${visit.user.id}`}</strong>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Who else will be there?</CardTitle>
          <CardDescription>
            People visiting {visit.city} with overlapping dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {overlapping.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No one else is visiting {visit.city} during this time. Feels
              lowkey solo rn 😔
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Arrive</TableHead>
                  <TableHead>Depart</TableHead>
                  <TableHead>Overlap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overlapping.map((ov) => {
                  const overlapStart = new Date(
                    Math.max(visit.arriveAt.getTime(), ov.arriveAt.getTime())
                  )
                  const overlapEnd = new Date(
                    Math.min(visit.departAt.getTime(), ov.departAt.getTime())
                  )
                  const days = Math.ceil(
                    (overlapEnd.getTime() - overlapStart.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )

                  return (
                    <TableRow key={ov.id}>
                      <TableCell className="font-medium">
                        {ov.user.name || `User #${ov.user.id}`}
                      </TableCell>
                      <TableCell>{formatDate(ov.arriveAt)}</TableCell>
                      <TableCell>{formatDate(ov.departAt)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {days} day{days !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
