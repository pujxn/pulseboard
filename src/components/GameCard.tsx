import { memo, useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { teamColor } from '@/lib/teamColors'
import StatusBadge from './StatusBadge'
import type { NormalizedGame } from '@/types'

interface Props {
  game: NormalizedGame
}

function ScoreNum({
  score,
  abbr,
  league,
  flash,
}: {
  score: number | null
  abbr: string
  league: 'NBA' | 'NFL'
  flash: boolean
}) {
  const color = teamColor(abbr, league)
  return (
    <div className="flex flex-col items-center gap-1 min-w-[52px]">
      <div
        className="text-xs font-bold tracking-widest uppercase"
        style={{ color }}
      >
        {abbr}
      </div>
      {score !== null ? (
        <div
          className={cn('font-mono text-3xl font-bold leading-none', flash && 'score-flash')}
          style={{ color }}
        >
          {score}
        </div>
      ) : (
        <div className="font-mono text-lg text-slate-600">—</div>
      )}
    </div>
  )
}

const GameCard = memo(function GameCard({ game }: Props) {
  const { homeTeam, visitorTeam, homeScore, visitorScore, gameState, statusLabel, league, postseason } = game

  const prevHomeRef = useRef(homeScore)
  const prevVisitorRef = useRef(visitorScore)
  const [flashHome, setFlashHome] = useState(false)
  const [flashVisitor, setFlashVisitor] = useState(false)

  useEffect(() => {
    if (homeScore !== null && homeScore !== prevHomeRef.current) {
      prevHomeRef.current = homeScore
      setFlashHome(true)
      const t = setTimeout(() => setFlashHome(false), 1200)
      return () => clearTimeout(t)
    }
  }, [homeScore])

  useEffect(() => {
    if (visitorScore !== null && visitorScore !== prevVisitorRef.current) {
      prevVisitorRef.current = visitorScore
      setFlashVisitor(true)
      const t = setTimeout(() => setFlashVisitor(false), 1200)
      return () => clearTimeout(t)
    }
  }, [visitorScore])

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 flex flex-col gap-3 hover:border-slate-700 transition-colors duration-150">
      {/* Status row */}
      <div className="flex items-center justify-between">
        <StatusBadge state={gameState} label={gameState === 'live' ? statusLabel : gameState === 'final' ? 'Final' : statusLabel} />
        {postseason && (
          <span className="text-[10px] font-mono text-amber-500/70 tracking-widest uppercase">Playoffs</span>
        )}
      </div>

      {/* Scoreboard */}
      <div className="flex items-center justify-between px-2">
        <ScoreNum
          score={visitorScore}
          abbr={visitorTeam.abbreviation}
          league={league}
          flash={flashVisitor}
        />

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-slate-700 text-xs font-mono">@</span>
          {gameState === 'live' && (
            <span className="text-[10px] font-mono text-slate-500">{statusLabel}</span>
          )}
        </div>

        <ScoreNum
          score={homeScore}
          abbr={homeTeam.abbreviation}
          league={league}
          flash={flashHome}
        />
      </div>

      {/* Team full names */}
      <div className="flex justify-between text-[10px] text-slate-600 font-mono px-1">
        <span className="truncate max-w-[45%]">{visitorTeam.fullName}</span>
        <span className="truncate max-w-[45%] text-right">{homeTeam.fullName}</span>
      </div>
    </div>
  )
})

export default GameCard

