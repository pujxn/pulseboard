import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/uiStore'
import type { League } from '@/types'

const LEAGUES: League[] = ['NBA', 'NFL']

export default function Header() {
  const { league, setLeague } = useUiStore()

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-sm font-bold tracking-widest text-slate-100 uppercase">
          PulseBoard
        </span>
        <span className="text-[10px] text-slate-700 tracking-widest uppercase hidden sm:block">
          Sports
        </span>
      </div>

      <div className="flex items-center gap-1">
        {LEAGUES.map((l) => (
          <button
            key={l}
            onClick={() => setLeague(l)}
            className={cn(
              'px-3 py-1 rounded text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-100',
              league === l
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="font-mono text-xs text-slate-700 hidden sm:block">
        {new Date().toLocaleTimeString('en-US', { hour12: false })} UTC
      </div>
    </header>
  )
}
