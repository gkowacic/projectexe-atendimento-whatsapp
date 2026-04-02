import type { KpiDashboard } from '@/types'

interface Props {
  data: KpiDashboard | null
}

function Card({
  label,
  value,
  sub,
  topColor,
  delay,
}: {
  label: string
  value: string
  sub: string
  topColor: string
  delay: number
}) {
  return (
    <div
      className={`card-hover relative overflow-hidden rounded-xl border border-[#1A2540] bg-[#0D1117] p-5 fade-up fade-up-${delay}`}
    >
      {/* top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${topColor}80, transparent)`,
        }}
      />
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B7A99] mb-4">
        {label}
      </p>
      <p
        className="font-mono text-3xl font-semibold tracking-tight leading-none"
        style={{ color: topColor }}
      >
        {value}
      </p>
      <p className="text-[11px] text-[#4A5568] mt-3 leading-none">{sub}</p>
    </div>
  )
}

export function KpiCards({ data }: Props) {
  const n = (v: number | undefined) => (v ?? 0).toLocaleString('pt-BR')
  const d = data ?? ({} as Partial<KpiDashboard>)
  const taxa = d.taxa_resolucao ?? 0
  const taxaColor = taxa >= 80 ? '#10B981' : taxa >= 60 ? '#F59E0B' : '#EF4444'
  const abertosColor =
    (d.chamados_abertos ?? 0) > 5 ? '#EF4444' : '#E8A020'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card
        label="Total Contatos"
        value={n(d.total_contatos)}
        sub="moradores cadastrados"
        topColor="#E8A020"
        delay={1}
      />
      <Card
        label="Condominios"
        value={n(d.condominios_ativos)}
        sub="em operacao"
        topColor="#6B7A99"
        delay={2}
      />
      <Card
        label="Chamados Abertos"
        value={n(d.chamados_abertos)}
        sub="aguardando resolucao"
        topColor={abertosColor}
        delay={3}
      />
      <Card
        label="Chamados Hoje"
        value={n(d.chamados_hoje)}
        sub="desde meia-noite"
        topColor="#6B7A99"
        delay={4}
      />
      <Card
        label="Chamados no Mes"
        value={n(d.chamados_mes)}
        sub="mes corrente"
        topColor="#6B7A99"
        delay={5}
      />
      <Card
        label="Taxa Resolucao"
        value={`${taxa.toFixed(1)}%`}
        sub="ultimos 30 dias"
        topColor={taxaColor}
        delay={6}
      />
    </div>
  )
}
