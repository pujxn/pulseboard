import InstrumentCard from './InstrumentCard'
import type { InstrumentId } from '@/types'

const INSTRUMENTS: InstrumentId[] = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'EUR/USD', 'GOLD']

interface Props {
  onSelect: (id: InstrumentId | null) => void
  selectedId: InstrumentId | null
}

export default function InstrumentGrid({ onSelect, selectedId }: Props) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
      {INSTRUMENTS.map((id) => (
        <InstrumentCard
          key={id}
          id={id}
          isSelected={selectedId === id}
          onClick={() => onSelect(selectedId === id ? null : id)}
        />
      ))}
    </div>
  )
}
