export default function AppLoading() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar skeleton */}
      <aside className="w-64 border-r flex flex-col min-h-0 p-4 gap-3">
        <div className="h-8 w-32 rounded-md bg-muted animate-pulse" />
        <div className="h-px bg-border my-1" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 rounded-md bg-muted animate-pulse" style={{ opacity: 1 - i * 0.12 }} />
        ))}
        <div className="mt-auto h-8 w-full rounded-md bg-muted animate-pulse opacity-40" />
      </aside>

      {/* Chat area skeleton */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col gap-6 p-8 overflow-hidden">
          {/* Assistant bubble */}
          <div className="flex gap-3 max-w-2xl">
            <div className="w-7 h-7 rounded-full bg-muted animate-pulse shrink-0 mt-1" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 rounded bg-muted animate-pulse w-3/4" />
              <div className="h-4 rounded bg-muted animate-pulse w-1/2" />
            </div>
          </div>
          {/* User bubble */}
          <div className="flex gap-3 max-w-2xl ml-auto flex-row-reverse">
            <div className="w-7 h-7 rounded-full bg-muted animate-pulse shrink-0 mt-1" />
            <div className="flex flex-col gap-2 items-end flex-1">
              <div className="h-4 rounded bg-muted animate-pulse w-48" />
            </div>
          </div>
          {/* Assistant bubble */}
          <div className="flex gap-3 max-w-2xl">
            <div className="w-7 h-7 rounded-full bg-muted animate-pulse shrink-0 mt-1" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 rounded bg-muted animate-pulse w-full" />
              <div className="h-4 rounded bg-muted animate-pulse w-5/6" />
              <div className="h-4 rounded bg-muted animate-pulse w-2/3" />
            </div>
          </div>
        </div>
        {/* Input bar skeleton */}
        <div className="p-4 border-t">
          <div className="h-12 rounded-xl bg-muted animate-pulse" />
        </div>
      </main>
    </div>
  )
}
