export default function Header() {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour12: false })

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[#1e1e2e]">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse" />
        <span className="font-mono text-sm font-bold tracking-widest text-[#e2e8f0] uppercase">
          PulseBoard
        </span>
        <span className="text-[10px] text-[#334155] tracking-widest uppercase">
          Market Simulator
        </span>
      </div>
      <div className="font-mono text-xs text-[#475569]">
        {time} UTC
      </div>
    </header>
  )
}
