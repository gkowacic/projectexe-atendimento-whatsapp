'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Chamado30d } from '@/types'

interface Props {
  data: Chamado30d[]
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function Chamados30dChart({ data }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const chartData = data.map((d) => ({ ...d, label: fmtDate(d.data) }))

  return (
    <div className="card-hover rounded-xl border border-[#1A2540] bg-[#0D1117] p-5 fade-up">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-4 rounded-full bg-[#E8A020]" />
        <h3 className="font-syne font-semibold text-[#E2DDD4] text-sm">
          Chamados &mdash; Ultimos 30 Dias
        </h3>
      </div>

      {!mounted ? (
        <div className="h-[220px] rounded-lg bg-[#131924] animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8A020" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#E8A020" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
              interval={4}
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
              labelStyle={{ color: '#6B7A99' }}
              cursor={{ stroke: '#E8A020', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="total"
              name="Chamados"
              stroke="#E8A020"
              strokeWidth={2}
              fill="url(#amberGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#E8A020', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
