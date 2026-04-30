# PulseBoard — Build Status

## Phase 1: Core Infrastructure + Instrument Cards ✅ DONE

### Files created
| File | Purpose |
|------|---------|
| `src/types.ts` | Shared types: InstrumentId, Instrument, Trade, PriceTick |
| `src/store/marketStore.ts` | Zustand store — prices, history (60 ticks), bid/ask, trades |
| `src/simulator/marketSimulator.ts` | setInterval-free random-walk price engine with fat-tail shocks |
| `src/lib/utils.ts` | formatPrice, formatChange, cn (tailwind-merge) |
| `src/components/Sparkline.tsx` | Recharts LineChart, memo-wrapped, axis-free |
| `src/components/InstrumentCard.tsx` | Card with price, %change, sparkline, bid/ask, flash animation |
| `src/components/InstrumentGrid.tsx` | 2→3 col responsive grid of 6 cards |
| `src/components/Header.tsx` | PulseBoard title + live indicator + UTC clock |
| `src/App.tsx` | Root — mounts simulator hook, holds selectedId state |

### Architecture decisions
- Simulator uses staggered recursive `setTimeout` (300–800ms) instead of a single `setInterval` so each instrument ticks at its own random cadence.
- Each card subscribes only to its own instrument via `useInstrument(id)` selector — no whole-store re-renders.
- History selector is separate (`useInstrumentHistory`) so the sparkline subscribes independently.
- Flash animation is CSS-only (keyframe classes), toggled via a `useEffect` on price change.
- `prevPrice` field on Instrument lets cards detect direction without storing extra ref state in the store.

---

## Phase 2: Detail Panel + Trade Entry 🔜 NEXT

Waiting for user sign-off on Phase 1 before building:
- `DetailPanel.tsx` — expanded chart (60 ticks, with axes), volume sim, Framer Motion layout animation
- `TradeForm.tsx` — Buy/Sell toggle, quantity input, Place Order button
- Trade optimistic update → 1.5s confirm/reject (20% rejection)
- Toast notification on submit/confirm/reject

## Phase 3: Trade History Panel 🔜 QUEUED

- Sidebar/bottom panel listing recent trades
- AnimatePresence entry animations
- Status badges: pending / confirmed / rejected

---

## Known limitations / decisions to revisit
- UTC clock in Header is static (rendered once at mount) — will drift. Can wire to `setInterval` later if desired.
- No real WebSocket — all simulation is client-side via setTimeout.
- Trade history capped at 200 entries in the store.
