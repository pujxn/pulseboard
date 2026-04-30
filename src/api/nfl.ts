import { useQuery } from '@tanstack/react-query'
import { apiFetch, type ApiList } from './client'
import { getGameState } from '@/lib/utils'
import type { NflGame, NflStanding } from '@/types'

export function useNflGames(date: string) {
  return useQuery({
    queryKey: ['nfl', 'games', date],
    queryFn: () =>
      apiFetch<ApiList<NflGame>>('/nfl/games', { 'dates[]': date, per_page: '100' }),
    refetchInterval: (query) => {
      const games = query.state.data?.data ?? []
      return games.some((g) => getGameState(g.status) === 'live') ? 30_000 : 60_000
    },
    staleTime: 20_000,
  })
}

export function useNflStandings(season: number) {
  return useQuery({
    queryKey: ['nfl', 'standings', season],
    queryFn: () =>
      apiFetch<ApiList<NflStanding>>('/nfl/standings', { season: String(season) }),
    staleTime: 5 * 60_000,
  })
}
