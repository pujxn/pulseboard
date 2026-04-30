# PulseBoard — Build Status

## Phase 1: Live Scores + Standings ✅ DONE

### Files
| File | Purpose |
|------|---------|
| `src/types.ts` | All types: NbaGame, NflGame, NbaStanding, NflStanding, NormalizedGame |
| `src/api/client.ts` | Base `apiFetch` — Authorization header, error handling |
| `src/api/nba.ts` | `useNbaGames`, `useNbaStandings` TanStack Query hooks |
| `src/api/nfl.ts` | `useNflGames`, `useNflStandings` TanStack Query hooks |
| `src/store/uiStore.ts` | Zustand — selected league (NBA/NFL) |
| `src/lib/utils.ts` | cn, todayDate, season helpers, getGameState, normalizeNbaGame/NflGame |
| `src/lib/teamColors.ts` | Primary color map for all NBA + NFL teams |
| `src/components/Header.tsx` | Title + league toggle buttons |
| `src/components/StatusBadge.tsx` | LIVE (pulsing dot) / FINAL / SCHEDULED badge |
| `src/components/GameCard.tsx` | Score card — team colors, score flash on update |
| `src/components/SkeletonCards.tsx` | Loading skeleton for game grid |
| `src/components/LiveScoresPanel.tsx` | Today's games — polls every 30s when live |
| `src/components/StandingsTable.tsx` | Conference standings for NBA/NFL |

### Architecture
- **Polling**: `refetchInterval` is dynamic — 30s when live games exist, 60s otherwise
- **Normalization**: Raw API shapes unified into `NormalizedGame` before rendering
- **Animations**: Framer Motion for card entrance (staggered) and league switch (fade+slide); CSS `brightness` keyframe for score flash
- **Data source**: `balldontlie.io` API, key from `VITE_BALLDONTLIE_API_KEY`

---

## Phase 2: Game Detail + Search 🔜 NEXT (waiting for sign-off)

- Click a game card → expand detail panel (Framer Motion layout animation)
- NBA box score: top performers, points/assists/rebounds
- Search input: find any team → recent games + record

---

## Known
- NFL off-season (May 2026): today's games panel will show empty state; standings still load
- NBA: May 2026 = playoffs — live games expected
- UTC clock in Header is static at render time
