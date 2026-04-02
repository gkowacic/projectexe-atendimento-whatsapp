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
import type { MoradorPorCondo } from '@/types'

interface Props {
  data: MoradorPorCondo[]
}

function shorten(name: string, max = 16) {
  return name.length > max ? name.substring(0, max - 1) + '\u2026' : name
}

export function MoradoresPorCondoChart({ data }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const sorted = [...data].sort((a, b) => b.total_moradores - a.total_moradores)
  const max = Math.max(...sorted.map((d) => d.total_moradores), 0)
  const chartData = sorted.map((d) => ({
    ...d,
    label: shorten(d.condominio_nome),
  }))

  return (
    <div className="card-hover rounded-xl border border-[#1A2540] bg-[#0D1117] p-5 fade-up">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-4 rounded-full bg-[#A855F7]" />
        <h3 className="font-syne font-semibold text-[#E2DDD4] text-sm">
          Moradores por Condominio
        </h3>
      </div>

      {!mounted ? (
        <div className="h-[220px] rounded-lg bg-[#131924] animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            barSize={14}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1A2540"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{
                fill: '#6B7A99',
                fontSize: 10,
                fontFamily: 'var(--font-jetbrains)',
              }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{
                fill: '#8B93A7',
                fontSize: 10,
                fontFamily: 'var(--font-dm-sans)',
              }}
              axisLine={false}
              tickLine={false}
              width={110}
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
              cursor={{ fill: 'rgba(168,85,247,0.06)' }}
              formatter={(value: number) => [
                value.toLocaleString('pt-BR'),
                'Moradores',
              ]}
            />
            <Bar
              dataKey="total_moradores"
              name="Moradores"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.total_moradores === max && max > 0
                      ? '#A855F7'
                      : '#3B1F6B'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
