import { useState } from 'react'
import { useMarketSimulator } from '@/simulator/marketSimulator'
import Header from '@/components/Header'
import InstrumentGrid from '@/components/InstrumentGrid'
import type { InstrumentId } from '@/types'

export default function App() {
  useMarketSimulator()
  const [selectedId, setSelectedId] = useState<InstrumentId | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Header />
      <main className="flex-1 p-6">
        <InstrumentGrid onSelect={setSelectedId} selectedId={selectedId} />
      </main>
    </div>
  )
}
