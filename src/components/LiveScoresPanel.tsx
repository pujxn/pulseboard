import { motion, AnimatePresence } from 'framer-motion'
import { useNbaGames } from '@/api/nba'
import { useNflGames } from '@/api/nfl'
import { todayDate, normalizeNbaGame, normalizeNflGame } from '@/lib/utils'
import GameCard from './GameCard'
import SkeletonCards from './SkeletonCards'
import type { League } from '@/types'

interface Props {
  league: League
}

function EmptyState({ league }: { league: League }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-600">
      <div className="text-4xl mb-3">
        {league === 'NBA' ? '🏀' : '🏈'}
      </div>
      <div className="font-mono text-sm">No {league} games scheduled today</div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-600">
      <div className="text-sm font-mono text-red-500/70 mb-1">Failed to load games</div>
      <div className="text-xs font-mono text-slate-700">{message}</div>
    </div>
  )
}

function NbaGames() {
  const today = todayDate()
  const { data, isLoading, error } = useNbaGames(today)

  if (isLoading) return <SkeletonCards count={4} />
  if (error) return <ErrorState message={(error as Error).message} />

  const games = (data?.data ?? []).map(normalizeNbaGame)
  if (games.length === 0) return <EmptyState league="NBA" />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <AnimatePresence>
        {games.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.22 }}>
            <GameCard game={g} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function NflGames() {
  const today = todayDate()
  const { data, isLoading, error } = useNflGames(today)

  if (isLoading) return <SkeletonCards count={4} />
  if (error) return <ErrorState message={(error as Error).message} />

  const games = (data?.data ?? []).map(normalizeNflGame)
  if (games.length === 0) return <EmptyState league="NFL" />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <AnimatePresence>
        {games.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.22 }}>
            <GameCard game={g} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function LiveScoresPanel({ league }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
          Today's Games
        </h2>
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-[10px] font-mono text-slate-700">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <motion.div
        key={league}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 8 }}
        transition={{ duration: 0.18 }}
      >
        {league === 'NBA' ? <NbaGames /> : <NflGames />}
      </motion.div>
    </div>
  )
}
