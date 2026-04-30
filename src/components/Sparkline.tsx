import { memo } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import type { PriceTick } from '@/types'

interface Props {
  history: PriceTick[]
  color: string
}

const Sparkline = memo(function Sparkline({ history, color }: Props) {
  const data = history.map((t) => ({ v: t.price }))
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
})

export default Sparkline
