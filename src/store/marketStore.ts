import { create } from 'zustand'
import type { Instrument, InstrumentId, Trade, PriceTick } from '@/types'

const HISTORY_LENGTH = 60

interface MarketState {
  instruments: Record<InstrumentId, Instrument>
  trades: Trade[]
}

interface MarketActions {
  updatePrice: (id: InstrumentId, price: number, bid: number, ask: number, volume: number) => void
  addTrade: (trade: Trade) => void
  updateTradeStatus: (id: string, status: 'confirmed' | 'rejected') => void
}

const INITIAL_PRICES: Record<InstrumentId, number> = {
  'BTC/USD': 67_420,
  'ETH/USD': 3_512,
  'AAPL':    182.5,
  'TSLA':    248.3,
  'EUR/USD': 1.0854,
  'GOLD':    2_345,
}

function makeInstrument(id: InstrumentId): Instrument {
  const price = INITIAL_PRICES[id]
  const spread = price * 0.0002
  const tick: PriceTick = { price, timestamp: Date.now() }
  return {
    id,
    price,
    prevPrice: price,
    changePercent: 0,
    history: Array.from({ length: HISTORY_LENGTH }, () => ({ ...tick })),
    bid: price - spread,
    ask: price + spread,
    volume: 0,
  }
}

const INSTRUMENT_IDS: InstrumentId[] = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'EUR/USD', 'GOLD']

export const useMarketStore = create<MarketState & MarketActions>((set) => ({
  instruments: Object.fromEntries(
    INSTRUMENT_IDS.map((id) => [id, makeInstrument(id)])
  ) as Record<InstrumentId, Instrument>,
  trades: [],

  updatePrice: (id, price, bid, ask, volume) =>
    set((state) => {
      const prev = state.instruments[id]
      const openPrice = prev.history[0]?.price ?? prev.price
      const changePercent = ((price - openPrice) / openPrice) * 100
      const newTick: PriceTick = { price, timestamp: Date.now() }
      const history = [...prev.history.slice(-(HISTORY_LENGTH - 1)), newTick]

      return {
        instruments: {
          ...state.instruments,
          [id]: { ...prev, price, prevPrice: prev.price, changePercent, history, bid, ask, volume },
        },
      }
    }),

  addTrade: (trade) =>
    set((state) => ({ trades: [trade, ...state.trades].slice(0, 200) })),

  updateTradeStatus: (id, status) =>
    set((state) => ({
      trades: state.trades.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
}))

export const useInstrument = (id: InstrumentId) =>
  useMarketStore((s) => s.instruments[id])

export const useInstrumentHistory = (id: InstrumentId) =>
  useMarketStore((s) => s.instruments[id].history)

export const useTrades = () => useMarketStore((s) => s.trades)
