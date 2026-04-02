'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { Atendimento7d } from '@/types'

interface Props {
  data: Atendimento7d[]
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

export function Atendimentos7dChart({ data }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const chartData = data.map((d) => ({ ...d, label: fmtDate(d.data) }))
  const max = Math.max(...data.map((d) => d.total), 0)

  return (
    <div className="card-hover rounded-xl border border-[#1A2540] bg-[#0D1117] p-5 fade-up">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-4 rounded-full bg-[#3B82F6]" />
        <h3 className="font-syne font-semibold text-[#E2DDD4] text-sm">
          Atendimentos &mdash; Ultimos 7 Dias
        </h3>
      </div>

      {!mounted ? (
        <div className="h-[220px] rounded-lg bg-[#131924] animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            barSize={28}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1A2540"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{
                fill: '#6B7A99',
                fontSize: 10,
                fontFamily: 'var(--font-jetbrains)',
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fill: '#6B7A99',
                fontSize: 10,
                fontFamily: 'var(--font-jetbrains)',
              }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#131924',
                border: '1px solid #1A2540',
                borderRadius: '8px',
                color: '#E2DDD4',
                fontSize: '12px',
                fontFamily: 'var(--font-jetbrains)',
              }}
              cursor={{ fill: 'rgba(59,130,246,0.06)' }}
            />
            <Bar dataKey="total" name="Atendimentos" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.total === max && max > 0 ? '#3B82F6' : '#1E3A5F'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
