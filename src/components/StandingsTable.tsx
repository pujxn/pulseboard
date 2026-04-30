import { motion } from 'framer-motion'
import { useNbaStandings } from '@/api/nba'
import { useNflStandings } from '@/api/nfl'
import { getNbaSeason, getNflSeason, winPct } from '@/lib/utils'
import { teamColor } from '@/lib/teamColors'
import type { League, NbaStanding, NflStanding } from '@/types'

// ── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRows({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-2 items-center animate-pulse py-1">
          <div className="h-3 w-4 bg-slate-800 rounded" />
          <div className="h-3 w-8 bg-slate-800 rounded" />
          <div className="h-3 flex-1 bg-slate-800 rounded" />
          <div className="h-3 w-12 bg-slate-800 rounded" />
          <div className="h-3 w-8 bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  )
}

// ── NBA standings ─────────────────────────────────────────────────────────────

function NbaConferenceBlock({ title, rows }: { title: string; rows: NbaStanding[] }) {
  const sorted = [...rows].sort((a, b) => a.conference_rank - b.conference_rank)
  return (
    <div>
      <div className="text-[10px] font-mono font-bold text-slate-600 tracking-widest uppercase mb-1.5 mt-3">
        {title}
      </div>
      <table className="w-full text-[11px] font-mono">
        <thead>
          <tr className="text-slate-700 border-b border-slate-800">
            <th className="text-left w-5 pb-1">#</th>
            <th className="text-left pb-1">Team</th>
            <th className="text-right w-8 pb-1">W</th>
            <th className="text-right w-8 pb-1">L</th>
            <th className="text-right w-12 pb-1">PCT</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => {
            const color = teamColor(s.team.abbreviation, 'NBA')
            const isPlayoffLine = i === 5 // top 6 make playoffs (+ play-in)
            return (
              <motion.tr
                key={s.team.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={isPlayoffLine ? 'border-t border-slate-700/50' : ''}
              >
                <td className="text-slate-600 py-0.5">{s.conference_rank}</td>
                <td className="py-0.5">
                  <span className="font-bold" style={{ color }}>{s.team.abbreviation}</span>
                </td>
                <td className="text-right text-slate-300 py-0.5">{s.wins}</td>
                <td className="text-right text-slate-500 py-0.5">{s.losses}</td>
                <td className="text-right text-slate-400 py-0.5">{winPct(s.wins, s.losses)}</td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function NbaStandingsContent() {
  const season = getNbaSeason()
  const { data, isLoading, error } = useNbaStandings(season)

  if (isLoading) return <SkeletonRows count={10} />
  if (error)
    return <div className="text-xs font-mono text-red-500/60 py-4">Failed to load standings</div>

  const standings = data?.data ?? []
  const east = standings.filter((s) => s.conference === 'East')
  const west = standings.filter((s) => s.conference === 'West')

  return (
    <div>
      <NbaConferenceBlock title={`Eastern Conference — ${season}-${String(season + 1).slice(2)}`} rows={east} />
      <NbaConferenceBlock title={`Western Conference — ${season}-${String(season + 1).slice(2)}`} rows={west} />
    </div>
  )
}

// ── NFL standings ─────────────────────────────────────────────────────────────

function NflConferenceBlock({ title, rows }: { title: string; rows: NflStanding[] }) {
  const sorted = [...rows].sort((a, b) => a.conference_rank - b.conference_rank)
  return (
    <div>
      <div className="text-[10px] font-mono font-bold text-slate-600 tracking-widest uppercase mb-1.5 mt-3">
        {title}
      </div>
      <table className="w-full text-[11px] font-mono">
        <thead>
          <tr className="text-slate-700 border-b border-slate-800">
            <th className="text-left w-5 pb-1">#</th>
            <th className="text-left pb-1">Team</th>
            <th className="text-right w-8 pb-1">W</th>
            <th className="text-right w-8 pb-1">L</th>
            <th className="text-right w-8 pb-1">T</th>
            <th className="text-right w-12 pb-1">PCT</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => {
            const color = teamColor(s.team.abbreviation, 'NFL')
            return (
              <motion.tr
                key={s.team.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <td className="text-slate-600 py-0.5">{s.conference_rank}</td>
                <td className="py-0.5">
                  <span className="font-bold" style={{ color }}>{s.team.abbreviation}</span>
                </td>
                <td className="text-right text-slate-300 py-0.5">{s.wins}</td>
                <td className="text-right text-slate-500 py-0.5">{s.losses}</td>
                <td className="text-right text-slate-600 py-0.5">{s.ties}</td>
                <td className="text-right text-slate-400 py-0.5">
                  {parseFloat(s.win_percentage).toFixed(3).replace(/^0/, '')}
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function NflStandingsContent() {
  const season = getNflSeason()
  const { data, isLoading, error } = useNflStandings(season)

  if (isLoading) return <SkeletonRows count={10} />
  if (error)
    return <div className="text-xs font-mono text-red-500/60 py-4">Failed to load standings</div>

  const standings = data?.data ?? []
  const afc = standings.filter((s) => s.conference === 'AFC')
  const nfc = standings.filter((s) => s.conference === 'NFC')

  return (
    <div>
      <NflConferenceBlock title={`AFC — ${getNflSeason()} Season`} rows={afc} />
      <NflConferenceBlock title={`NFC — ${getNflSeason()} Season`} rows={nfc} />
    </div>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export default function StandingsTable({ league }: { league: League }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
          Standings
        </h2>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <motion.div
        key={league}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.18 }}
      >
        {league === 'NBA' ? <NbaStandingsContent /> : <NflStandingsContent />}
      </motion.div>
    </div>
  )
}
