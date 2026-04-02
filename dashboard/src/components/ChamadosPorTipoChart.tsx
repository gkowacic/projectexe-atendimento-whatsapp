'use client'

import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ChamadoPorTipo } from '@/types'

interface Props {
  data: ChamadoPorTipo[]
}

const COLORS = [
  '#E8A020',
  '#10B981',
  '#3B82F6',
  '#A855F7',
  '#EF4444',
  '#F59E0B',
  '#06B6D4',
  '#EC4899',
]

const TIPO_LABEL: Record<string, string> = {
  infiltracao: 'Infiltracao',
  barulho: 'Barulho',
  manutencao: 'Manutencao',
  seguranca: 'Seguranca',
  limpeza: 'Limpeza',
  reserva: 'Reserva',
  cadastro: 'Cadastro',
  outros: 'Outros',
}

export function ChamadosPorTipoChart({ data }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const total = data.reduce((s, d) => s + d.total, 0)

  return (
    <div className="card-hover rounded-xl border border-[#1A2540] bg-[#0D1117] p-5 fade-up">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-4 rounded-full bg-[#10B981]" />
        <h3 className="font-syne font-semibold text-[#E2DDD4] text-sm">
          Chamados por Tipo
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="h-[220px] flex items-center justify-center">
          <span className="font-mono text-sm text-[#4A5568]">Sem dados</span>
        </div>
      ) : !mounted ? (
        <div className="h-[220px] rounded-lg bg-[#131924] animate-pulse" />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={68}
                dataKey="total"
                nameKey="tipo"
                strokeWidth={0}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#131924',
                  border: '1px solid #1A2540',
                  borderRadius: '8px',
                  color: '#E2DDD4',
                  fontSize: '11px',
                  fontFamily: 'var(--font-jetbrains)',
                }}
                formatter={(value: number, name: string) => [
                  `${value} (${total > 0 ? ((value / total) * 100).toFixed(0) : 0}%)`,
                  TIPO_LABEL[name] ?? name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {data.slice(0, 6).map((d, i) => (
              <div key={d.tipo} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  <span className="font-mono text-[11px] text-[#8B93A7]">
                    {TIPO_LABEL[d.tipo] ?? d.tipo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#E2DDD4]">
                    {d.total}
                  </span>
                  {total > 0 && (
                    <span className="font-mono text-[10px] text-[#4A5568] w-8 text-right">
                      {((d.total / total) * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
