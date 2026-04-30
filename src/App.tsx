import { useUiStore } from '@/store/uiStore'
import Header from '@/components/Header'
import LiveScoresPanel from '@/components/LiveScoresPanel'
import StandingsTable from '@/components/StandingsTable'

export default function App() {
  const league = useUiStore((s) => s.league)

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6 max-w-7xl mx-auto w-full">
        <LiveScoresPanel league={league} />
        <aside className="overflow-y-auto max-h-[calc(100vh-80px)] pr-1">
          <StandingsTable league={league} />
        </aside>
      </main>
    </div>
  )
}
