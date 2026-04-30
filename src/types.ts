export type InstrumentId = 'BTC/USD' | 'ETH/USD' | 'AAPL' | 'TSLA' | 'EUR/USD' | 'GOLD'

export type TradeStatus = 'pending' | 'confirmed' | 'rejected'
export type TradeDirection = 'buy' | 'sell'

export interface PriceTick {
  price: number
  timestamp: number
}

export interface Instrument {
  id: InstrumentId
  price: number
  prevPrice: number
  changePercent: number
  history: PriceTick[]
  bid: number
  ask: number
  volume: number
}

export interface Trade {
  id: string
  instrument: InstrumentId
  direction: TradeDirection
  quantity: number
  price: number
  timestamp: number
  status: TradeStatus
}
