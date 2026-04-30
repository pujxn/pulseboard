import { useQuery } from '@tanstack/react-query'
import { apiFetch, type ApiList } from './client'
import { getGameState } from '@/lib/utils'
import type { NbaGame, NbaStanding } from '@/types'

export function useNbaGames(date: string) {
  return useQuery({
    queryKey: ['nba', 'games', date],
    queryFn: () =>
      apiFetch<ApiList<NbaGame>>('/games', { 'dates[]': date, per_page: '100' }),
    refetchInterval: (query) => {
      const games = query.state.data?.data ?? []
      return games.some((g) => getGameState(g.status) === 'live') ? 30_000 : 60_000
    },
    staleTime: 20_000,
  })
}

export function useNbaStandings(season: number) {
  return useQuery({
    queryKey: ['nba', 'standings', season],
    queryFn: () =>
      apiFetch<ApiList<NbaStanding>>('/standings', { season: String(season) }),
    staleTime: 5 * 60_000,
  })
}
