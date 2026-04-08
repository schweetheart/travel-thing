import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export default function TestPage() {
  try {
    const users = getDb().user.findMany()
    console.log(users)
  } catch (error) {
    console.error("Error in TestPage:", error)
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="space-y-6 text-center">
        <h1 className="text-5xl font-bold text-white">
          Yo, hello world fr fr 🔥
        </h1>
        <p className="text-lg text-slate-300">No cap, this page is bussin</p>
        <Button variant="default" size="lg">
          Let's go
        </Button>
      </div>
    </div>
  )
}
