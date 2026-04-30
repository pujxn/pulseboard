export type League = 'NBA' | 'NFL'
export type GameState = 'live' | 'final' | 'scheduled'

// ── NBA ──────────────────────────────────────────────────────────────────────

export interface NbaTeam {
  id: number
  abbreviation: string
  city: string
  conference: string
  division: string
  full_name: string
  name: string
}

export interface NbaGame {
  id: number
  date: string
  home_team_score: number
  visitor_team_score: number
  season: number
  period: number
  status: string
  time: string
  postseason: boolean
  home_team: NbaTeam
  visitor_team: NbaTeam
}

export interface NbaStanding {
  team: NbaTeam
  conference: string
  division: string
  wins: number
  losses: number
  conference_rank: number
  division_rank: number
}

// ── NFL ──────────────────────────────────────────────────────────────────────

export interface NflTeam {
  id: number
  abbreviation: string
  city: string
  conference: string
  division: string
  full_name: string
  name: string
}

export interface NflGame {
  id: number
  date: string
  home_team: NflTeam
  visitor_team: NflTeam
  home_team_score: number | null
  visitor_team_score: number | null
  status: string
  period: number | null
  time_remaining: string | null
  week: number
  season: number
  postseason: boolean
}

export interface NflStanding {
  team: NflTeam
  conference: string
  division: string
  wins: number
  losses: number
  ties: number
  conference_rank: number
  division_rank: number
  win_percentage: string
}

// ── Normalized (used by GameCard) ─────────────────────────────────────────────

export interface NormalizedGame {
  id: number
  league: League
  homeTeam: { abbreviation: string; fullName: string }
  visitorTeam: { abbreviation: string; fullName: string }
  homeScore: number | null
  visitorScore: number | null
  gameState: GameState
  statusLabel: string   // "Q4 2:35", "Halftime", "FINAL", "7:30 PM ET"
  postseason: boolean
}
