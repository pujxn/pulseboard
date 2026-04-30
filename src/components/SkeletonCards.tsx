export default function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-slate-800 bg-slate-950 p-4 animate-pulse">
          <div className="h-4 w-16 bg-slate-800 rounded mb-4" />
          <div className="flex justify-between items-center px-2 mb-3">
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-10 bg-slate-800 rounded" />
              <div className="h-8 w-12 bg-slate-800 rounded" />
            </div>
            <div className="h-3 w-4 bg-slate-800 rounded" />
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 w-10 bg-slate-800 rounded" />
              <div className="h-8 w-12 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="h-2.5 w-24 bg-slate-800 rounded" />
            <div className="h-2.5 w-24 bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
