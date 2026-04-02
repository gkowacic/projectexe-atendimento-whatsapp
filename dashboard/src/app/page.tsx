import { createServerClient } from '@/lib/supabase'
import { KpiCards } from '@/components/KpiCards'
import { Chamados30dChart } from '@/components/Chamados30dChart'
import { ChamadosPorTipoChart } from '@/components/ChamadosPorTipoChart'
import { Atendimentos7dChart } from '@/components/Atendimentos7dChart'
import { MoradoresPorCondoChart } from '@/components/MoradoresPorCondoChart'
import { ChamadosAbertosTable } from '@/components/ChamadosAbertosTable'
import type {
  KpiDashboard,
  MoradorPorCondo,
  ChamadoAberto,
  Chamado30d,
  ChamadoPorTipo,
  Atendimento7d,
} from '@/types'

export const revalidate = 60

async function getData() {
  const supabase = createServerClient()

  const [
    { data: kpi },
    { data: moradores },
    { data: abertos },
    { data: chamados30 },
    { data: porTipo },
    { data: atend7 },
  ] = await Promise.all([
    supabase.from('kpi_dashboard').select('*').single(),
    supabase.from('kpi_moradores_por_condo').select('*'),
    supabase
      .from('kpi_chamados_abertos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase.from('kpi_chamados_30d').select('*').order('data'),
    supabase
      .from('kpi_chamados_por_tipo')
      .select('*')
      .order('total', { ascending: false }),
    supabase.from('kpi_atendimentos_7d').select('*').order('data'),
  ])

  return {
    kpi: kpi as KpiDashboard | null,
    moradores: (moradores ?? []) as MoradorPorCondo[],
    abertos: (abertos ?? []) as ChamadoAberto[],
    chamados30: (chamados30 ?? []) as Chamado30d[],
    porTipo: (porTipo ?? []) as ChamadoPorTipo[],
    atend7: (atend7 ?? []) as Atendimento7d[],
  }
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: color }} />
      <span
        className="font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  )
}

export default async function Dashboard() {
  const { kpi, moradores, abertos, chamados30, porTipo, atend7 } = await getData()

  const nowStr = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Sao_Paulo',
  })

  return (
    <div className="min-h-screen grid-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1A2540] bg-[#07090E]/90 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#E8A020] flex-shrink-0">
              <span className="font-syne font-black text-[10px] text-black tracking-tight leading-none">
                PE
              </span>
            </div>
            <div className="flex items-center gap-0">
              <span className="font-syne font-bold text-[#E2DDD4] text-sm leading-none">
                ProjectEXE
              </span>
              <span className="text-[#2A3550] mx-2.5 text-sm">/</span>
              <span className="font-mono text-[10px] text-[#6B7A99] uppercase tracking-widest">
                KPI Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </span>
              <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-wider">
                Sistema Ativo
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#4A5568] capitalize hidden md:block">
              {nowStr}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* Visao Geral */}
        <section>
          <SectionLabel label="Visao Geral" color="#E8A020" />
          <KpiCards data={kpi} />
        </section>

        {/* Tendencias */}
        <section>
          <SectionLabel label="Tendencias" color="#3B82F6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <Chamados30dChart data={chamados30} />
            </div>
            <ChamadosPorTipoChart data={porTipo} />
          </div>
        </section>

        {/* Volume */}
        <section>
          <SectionLabel label="Volume" color="#A855F7" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Atendimentos7dChart data={atend7} />
            <MoradoresPorCondoChart data={moradores} />
          </div>
        </section>

        {/* Chamados em Aberto */}
        <section>
          <SectionLabel label="Chamados em Aberto" color="#EF4444" />
          <ChamadosAbertosTable data={abertos} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A2540] mt-4 py-5">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          <p className="font-mono text-[10px] text-[#2A3550]">
            ProjectEXE KPI Dashboard &copy; 2026
          </p>
          <p className="font-mono text-[10px] text-[#2A3550]">
            Revalidacao automatica &middot; 60s
          </p>
        </div>
      </footer>
    </div>
  )
}
