import { cn } from '@/lib/utils'
import type { GameState } from '@/types'

interface Props {
  state: GameState
  label: string
}

export default function StatusBadge({ state, label }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider uppercase',
        state === 'live' && 'bg-red-950/60 text-red-400',
        state === 'final' && 'bg-emerald-950/40 text-emerald-500',
        state === 'scheduled' && 'bg-slate-800/60 text-slate-400'
      )}
    >
      {state === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
      )}
      {label}
    </span>
  )
}
