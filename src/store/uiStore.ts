import { create } from 'zustand'
import type { League } from '@/types'

interface UiState {
  league: League
  setLeague: (l: League) => void
}

export const useUiStore = create<UiState>((set) => ({
  league: 'NBA',
  setLeague: (league) => set({ league }),
}))
