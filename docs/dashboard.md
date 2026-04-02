# KPI Dashboard — Documentação

## Visão Geral

Dashboard Next.js 14 que consome as views KPI do Supabase em tempo real.

**Repo:** `gkowacic/projectexe-atendimento-whatsapp`  
**Pasta:** `dashboard/`  
**Design:** Control Room dark — âmbar `#E8A020`, fontes Syne + JetBrains Mono  

---

## Stack

| Componente | Detalhe |
|---|---|
| Framework | Next.js 14 (App Router) |
| Estilo | Tailwind CSS |
| Gráficos | Recharts |
| Banco | Supabase (via `@supabase/supabase-js`) |
| Tipografia | Syne + JetBrains Mono + DM Sans (Google Fonts) |
| Revalidação | 60 segundos (ISR) |

---

## Componentes

| Componente | View consumida | Tipo |
|---|---|---|
| `KpiCards` | `kpi_dashboard` | 6 cards com thresholds de cor |
| `Chamados30dChart` | `kpi_chamados_30d` | AreaChart (âmbar) |
| `ChamadosPorTipoChart` | `kpi_chamados_por_tipo` | Donut chart com legenda |
| `Atendimentos7dChart` | `kpi_atendimentos_7d` | BarChart (barra máxima destacada) |
| `MoradoresPorCondoChart` | `kpi_moradores_por_condo` | Horizontal BarChart |
| `ChamadosAbertosTable` | `kpi_chamados_abertos` | Tabela com badges de prioridade |

---

## Setup Local

```bash
cd dashboard
npm install
cp .env.local.example .env.local
# preencher SUPABASE_ANON_KEY no .env.local
npm run dev
# → http://localhost:3000
```

### Variáveis de Ambiente

| Variável | Valor |
|---|---|
| `SUPABASE_URL` | `https://GQfB9He6oEKDaFkx.supabase.co` (já como fallback no código) |
| `SUPABASE_ANON_KEY` | Obter em Supabase → Project Settings → API → anon public |

---

## Deploy Vercel

1. [vercel.com/new](https://vercel.com/new) → importar `gkowacic/projectexe-atendimento-whatsapp`
2. **Root Directory:** `dashboard`
3. **Environment Variables:** adicionar `SUPABASE_ANON_KEY`
4. Deploy → URL pública gerada automaticamente

> Toda vez que fizer push para `main`, o Vercel re-deploya automaticamente.

---

## Estrutura de Arquivos

```
dashboard/
  src/
    app/
      layout.tsx          # Fonts + metadata
      page.tsx            # Server component — busca as 6 views em paralelo
      globals.css         # Tailwind + animações
    components/
      KpiCards.tsx
      Chamados30dChart.tsx
      ChamadosPorTipoChart.tsx
      Atendimentos7dChart.tsx
      MoradoresPorCondoChart.tsx
      ChamadosAbertosTable.tsx
    lib/
      supabase.ts         # createServerClient()
    types/
      index.ts            # Tipos TypeScript das views
  .env.local.example
  .gitignore
  package.json
  tailwind.config.ts
  tsconfig.json
```

---

## Views KPI (Supabase)

Recriar views: `curl -X POST http://localhost:5678/webhook/criar-views-kpi -d "{}"`

| View | Colunas principais |
|---|---|
| `kpi_dashboard` | `total_contatos`, `condominios_ativos`, `chamados_abertos`, `chamados_hoje`, `chamados_mes`, `atendimentos_hoje`, `taxa_resolucao` |
| `kpi_moradores_por_condo` | `condominio_nome`, `total_moradores` |
| `kpi_chamados_abertos` | `id`, `tipo`, `prioridade`, `condominio_nome`, `created_at`, `descricao`, `status` |
| `kpi_chamados_30d` | `data`, `total` |
| `kpi_chamados_por_tipo` | `tipo`, `total` |
| `kpi_atendimentos_7d` | `data`, `total` |
