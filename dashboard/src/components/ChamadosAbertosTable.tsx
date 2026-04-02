import type { ChamadoAberto } from '@/types'

interface Props {
  data: ChamadoAberto[]
}

const PRIORIDADE: Record<string, { label: string; cls: string }> = {
  alta: {
    label: 'Alta',
    cls: 'bg-red-500/10 text-red-400 border border-red-500/20',
  },
  media: {
    label: 'Media',
    cls: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  },
  baixa: {
    label: 'Baixa',
    cls: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  },
}

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

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

export function ChamadosAbertosTable({ data }: Props) {
  return (
    <div className="card-hover rounded-xl border border-[#1A2540] bg-[#0D1117] fade-up">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A2540]">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-[#EF4444]" />
          <h3 className="font-syne font-semibold text-[#E2DDD4] text-sm">
            Chamados em Aberto
          </h3>
        </div>
        <span className="font-mono text-[10px] text-[#6B7A99] bg-[#131924] border border-[#1A2540] px-2.5 py-1 rounded-md">
          {data.length} registros
        </span>
      </div>

      {/* Empty state */}
      {data.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#1A2540] flex items-center justify-center">
            <span className="text-[#4A5568] text-xs">0</span>
          </div>
          <p className="font-mono text-sm text-[#4A5568]">
            Nenhum chamado em aberto
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A2540]">
                {[
                  'Condominio',
                  'Tipo',
                  'Prioridade',
                  'Descricao',
                  'Abertura',
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-[#4A5568] font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((c, i) => {
                const prio =
                  PRIORIDADE[c.prioridade] ?? PRIORIDADE.baixa
                return (
                  <tr
                    key={c.id ?? i}
                    className="border-b border-[#0F1720] last:border-0 hover:bg-[#0F1720] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium text-[#E2DDD4]">
                        {c.condominio_nome || '\u2014'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] text-[#8B93A7]">
                        {TIPO_LABEL[c.tipo] ?? c.tipo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium ${prio.cls}`}
                      >
                        {prio.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <span className="text-xs text-[#6B7A99] block truncate">
                        {c.descricao || '\u2014'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-[#6B7A99]">
                        {c.created_at ? fmtDate(c.created_at) : '\u2014'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
