export default function Loading() {
  return (
    <div className="mx-auto flex max-w-3xl animate-pulse flex-col gap-6 p-6">
      <div className="h-8 w-1/3 rounded bg-muted" />
      <div className="flex items-center gap-2 border-b pb-4">
        <div className="h-8 w-8 rounded-full bg-muted" />
        <div className="h-6 w-1/4 rounded bg-muted" />
      </div>
      <div className="h-6 w-full rounded bg-muted" />
      <div className="h-6 w-full rounded bg-muted" />
      <div className="h-6 w-full rounded bg-muted" />
    </div>
  )
}
