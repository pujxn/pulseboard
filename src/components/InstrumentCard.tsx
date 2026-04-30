import { memo, useRef, useEffect, useState } from 'react'
import { useInstrument, useInstrumentHistory } from '@/store/marketStore'
import { formatPrice, formatChange, cn } from '@/lib/utils'
import Sparkline from './Sparkline'
import type { InstrumentId } from '@/types'

interface Props {
  id: InstrumentId
  onClick: () => void
  isSelected: boolean
}

const LABELS: Record<InstrumentId, string> = {
  'BTC/USD': 'Bitcoin',
  'ETH/USD': 'Ethereum',
  'AAPL':    'Apple Inc.',
  'TSLA':    'Tesla Inc.',
  'EUR/USD': 'Euro / USD',
  'GOLD':    'Gold Spot',
}

const InstrumentCard = memo(function InstrumentCard({ id, onClick, isSelected }: Props) {
  const { price, prevPrice, changePercent, bid, ask } = useInstrument(id)
  const history = useInstrumentHistory(id)

  const [flashClass, setFlashClass] = useState('')
  const prevRef = useRef(prevPrice)

  useEffect(() => {
    const prev = prevRef.current
    if (price === prev) return
    prevRef.current = price
    // Only flash on moves >= 0.05% to ignore micro-noise
    const movePct = Math.abs((price - prev) / prev)
    if (movePct < 0.0005) return
    const up = price > prev
    setFlashClass(up ? 'price-flash-up' : 'price-flash-down')
    const t = setTimeout(() => setFlashClass(''), 1200)
    return () => clearTimeout(t)
  }, [price])

  const up = changePercent >= 0
  const changeColor = up ? '#00c853' : '#ff1744'
  const spread = ((ask - bid) / bid * 100).toFixed(3)

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative text-left rounded-lg border p-4 transition-colors duration-150 cursor-pointer w-full',
        isSelected
          ? 'border-[#4a9eff] bg-[#0d1420]'
          : 'border-[#1e1e2e] bg-[#0d0d17] hover:border-[#2a2a3e]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-[#64748b] tracking-widest uppercase mb-0.5">
            {LABELS[id]}
          </div>
          <div className="text-sm font-semibold text-[#94a3b8]">{id}</div>
        </div>
        <span
          className="text-xs font-mono px-1.5 py-0.5 rounded"
          style={{
            color: changeColor,
            backgroundColor: up ? 'rgba(0,200,83,0.1)' : 'rgba(255,23,68,0.1)',
          }}
        >
          {formatChange(changePercent)}
        </span>
      </div>

      {/* Price */}
      <div
        className={cn('font-mono text-2xl font-bold mb-3 tracking-tight', flashClass)}
        style={{ color: changeColor }}
      >
        {formatPrice(price, id)}
      </div>

      {/* Sparkline */}
      <div className="mb-3 -mx-1">
        <Sparkline history={history} color={changeColor} />
      </div>

      {/* Bid / Ask */}
      <div className="flex justify-between text-[10px] font-mono text-[#475569]">
        <span>
          B <span className="text-[#94a3b8]">{formatPrice(bid, id)}</span>
        </span>
        <span className="text-[#1e2d3d]">spd {spread}%</span>
        <span>
          A <span className="text-[#94a3b8]">{formatPrice(ask, id)}</span>
        </span>
      </div>
    </button>
  )
})

export default InstrumentCard
