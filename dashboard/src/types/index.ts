export interface KpiDashboard {
  total_contatos: number
  condominios_ativos: number
  chamados_abertos: number
  chamados_hoje: number
  chamados_mes: number
  atendimentos_hoje: number
  taxa_resolucao: number
}

export interface MoradorPorCondo {
  condominio_nome: string
  total_moradores: number
}

export interface ChamadoAberto {
  id: string
  tipo: string
  prioridade: string
  condominio_nome: string
  created_at: string
  descricao: string
  status: string
}

export interface Chamado30d {
  data: string
  total: number
}

export interface ChamadoPorTipo {
  tipo: string
  total: number
}

export interface Atendimento7d {
  data: string
  total: number
}
