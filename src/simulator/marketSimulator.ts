import { useEffect } from 'react'
import { useMarketStore } from '@/store/marketStore'
import type { InstrumentId } from '@/types'

type UpdatePriceFn = (id: InstrumentId, price: number, bid: number, ask: number, volume: number) => void

interface SimConfig {
  basePrice: number
  volatility: number    // std dev as fraction of price per tick
  drift: number         // slight upward/downward bias
  spreadFraction: number
}

const CONFIGS: Record<InstrumentId, SimConfig> = {
  'BTC/USD': { basePrice: 67_420,  volatility: 0.0015, drift: 0.00002,  spreadFraction: 0.0002 },
  'ETH/USD': { basePrice: 3_512,   volatility: 0.0018, drift: 0.00001,  spreadFraction: 0.0002 },
  'AAPL':    { basePrice: 182.5,   volatility: 0.0008, drift: 0.000005, spreadFraction: 0.0003 },
  'TSLA':    { basePrice: 248.3,   volatility: 0.0014, drift: -0.00001, spreadFraction: 0.0003 },
  'EUR/USD': { basePrice: 1.0854,  volatility: 0.0003, drift: 0.000001, spreadFraction: 0.0001 },
  'GOLD':    { basePrice: 2_345,   volatility: 0.0006, drift: 0.00001,  spreadFraction: 0.0001 },
}

// Box-Muller transform for normal distribution
function randn(): number {
  const u = 1 - Math.random()
  const v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function randBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Current simulated prices — kept outside React so they persist across renders
const currentPrices: Record<string, number> = {}

function tickInstrument(id: InstrumentId, updatePrice: UpdatePriceFn) {
  const cfg = CONFIGS[id]
  const prev = currentPrices[id] ?? cfg.basePrice

  // Occasional large move (fat tails) — 3% chance per tick
  const shock = Math.random() < 0.03 ? randn() * cfg.volatility * 4 : 0
  const move = (cfg.drift + randn() * cfg.volatility + shock) * prev
  const price = Math.max(prev + move, prev * 0.5) // floor at 50% of prev to prevent nonsense

  currentPrices[id] = price

  const spread = price * cfg.spreadFraction
  const bid = price - spread / 2
  const ask = price + spread / 2
  const volume = Math.round(randBetween(50, 2000))

  updatePrice(id, price, bid, ask, volume)
}

const INSTRUMENT_IDS: InstrumentId[] = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'EUR/USD', 'GOLD']

export function useMarketSimulator() {
  const updatePrice = useMarketStore((s) => s.updatePrice)

  useEffect(() => {
    // Stagger initial ticks so instruments don't all update at once
    const timers: ReturnType<typeof setTimeout>[] = []

    function scheduleNext(id: InstrumentId) {
      const delay = randBetween(300, 800)
      const t = setTimeout(() => {
        tickInstrument(id, updatePrice)
        scheduleNext(id)
      }, delay)
      timers.push(t)
    }

    INSTRUMENT_IDS.forEach((id, i) => {
      // Small initial stagger so first ticks don't all fire simultaneously
      const initialDelay = i * 50
      const t = setTimeout(() => scheduleNext(id), initialDelay)
      timers.push(t)
    })

    return () => timers.forEach(clearTimeout)
  }, [updatePrice])
}
