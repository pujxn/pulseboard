import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { GameState, NbaGame, NflGame, NormalizedGame } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getNbaSeason(): number {
  const d = new Date()
  // NBA season: Oct current year → Jun next year. Season labeled by start year.
  return d.getMonth() + 1 >= 10 ? d.getFullYear() : d.getFullYear() - 1
}

export function getNflSeason(): number {
  const d = new Date()
  // NFL season: Sep → Feb. Season labeled by the fall year.
  return d.getMonth() + 1 >= 9 ? d.getFullYear() : d.getFullYear() - 1
}

export function getGameState(status: string): GameState {
  const s = status.toLowerCase().trim()
  if (s.includes('final') || s === 'f') return 'final'
  if (
    s.includes('halftime') ||
    s.includes('half') ||
    s.includes('qtr') ||
    s.includes('quarter') ||
    /^[1-4](st|nd|rd|th)/.test(s) ||
    /^q[1-4]/.test(s) ||
    // time remaining format like "3:45" with no AM/PM
    (/\d+:\d+/.test(s) && !/[ap]m/i.test(s))
  )
    return 'live'
  return 'scheduled'
}

export function formatScheduledTime(isoOrTimeStr: string): string {
  // If it's an ISO datetime, parse and show local time
  if (isoOrTimeStr.includes('T') || isoOrTimeStr.includes('Z')) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      }).format(new Date(isoOrTimeStr))
    } catch {
      return isoOrTimeStr
    }
  }
  // Otherwise it's already a formatted string like "7:30 pm ET"
  return isoOrTimeStr
}

export function winPct(wins: number, losses: number): string {
  const total = wins + losses
  if (total === 0) return '.000'
  return (wins / total).toFixed(3).replace(/^0/, '')
}

// ── Game normalization ────────────────────────────────────────────────────────

export function normalizeNbaGame(g: NbaGame): NormalizedGame {
  const gameState = getGameState(g.status)
  let statusLabel: string
  if (gameState === 'final') {
    statusLabel = g.status.toUpperCase().includes('OT') ? 'FINAL/OT' : 'FINAL'
  } else if (gameState === 'live') {
    statusLabel = g.status
  } else {
    statusLabel = formatScheduledTime(g.status)
  }

  return {
    id: g.id,
    league: 'NBA',
    homeTeam: { abbreviation: g.home_team.abbreviation, fullName: g.home_team.full_name },
    visitorTeam: { abbreviation: g.visitor_team.abbreviation, fullName: g.visitor_team.full_name },
    homeScore: gameState === 'scheduled' ? null : g.home_team_score,
    visitorScore: gameState === 'scheduled' ? null : g.visitor_team_score,
    gameState,
    statusLabel,
    postseason: g.postseason,
  }
}

export function normalizeNflGame(g: NflGame): NormalizedGame {
  const gameState = getGameState(g.status)
  let statusLabel: string
  if (gameState === 'final') {
    statusLabel = 'FINAL'
  } else if (gameState === 'live') {
    const period = g.period ? `Q${g.period}` : ''
    const time = g.time_remaining ?? ''
    statusLabel = [period, time].filter(Boolean).join(' ')
  } else {
    statusLabel = formatScheduledTime(g.date)
  }

  return {
    id: g.id,
    league: 'NFL',
    homeTeam: { abbreviation: g.home_team.abbreviation, fullName: g.home_team.full_name },
    visitorTeam: { abbreviation: g.visitor_team.abbreviation, fullName: g.visitor_team.full_name },
    homeScore: g.home_team_score,
    visitorScore: g.visitor_team_score,
    gameState,
    statusLabel,
    postseason: g.postseason,
  }
}
