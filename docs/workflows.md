# ProjectEXE Atendimento WhatsApp v4.1 — Workflows n8n

## Arquitetura

```
WhatsApp (API Oficial Meta)
    ↓
Evolution API (VPS Locaweb)
    ↓
Webhook n8n
    ↓
[Orquestrador Haiku] — classifica mensagem
    ↓
[Agente Sonnet especialista] — responde + emite tags de ação
    ↓
[Parser de tags] — executa ações via sub-workflows Condfy
    ↓
Resposta ao morador
```

---

## IDs dos Workflows

### Workflows Principais

| Workflow | ID | Status |
|---|---|---|
| Orquestrador Haiku | `gff6jdJlaHVffagk` | Ativo |
| Agente Cadastro | `Kwvtjmoh4prm7OlA` | Ativo |
| Agente Chamado | `ktzZOHsJie08H5PR` | Ativo |
| Agente Lead | `EncZOoqh4guBZK3r` | Ativo |
| Agente Operacional | `pNM9Yez5y1RUeD0z` | Ativo |

### Sub-workflows Condfy

| Workflow | ID | Status | Testado |
|---|---|---|---|
| condfy-consultar | `zjTlC9KhcxC5n0iU` | Ativo | ✅ |
| condfy-excluir | `pqqSU1eo4N1pdrxg` | Ativo | — |
| condfy-cadastrar | `BtvDTOUItduxjt7t` | Ativo | — |
| condfy-convidar | `5Wn8Mka7zHJPARkR` | Ativo | ✅ |

### Workflows de Suporte

| Workflow | ID | Status | Observação |
|---|---|---|---|
| Sync diário Condfy → Supabase | `a5EU8tNlYkfrjojl` | Ativo | Cron 06:00 |
| Scrape Condo (sub) | `dAZJccR3zMnEjUCM` | Ativo | Chamado pelo sync |
| Util criar views KPI | `wXGAyH6DilJA22Gx` | Ativo | Rodar só quando precisar recriar views |
| Relatório Semanal | `kYrNrGKMHQyqCXu9` | Ativo | Schedule segunda 09:00 BRT |

---

## Credenciais n8n

| Credencial | ID |
|---|---|
| Supabase (Postgres direto) | `GQfB9He6oEKDaFkx` |
| Anthropic | `i4lndXDTCgIBR0A0` |

---

## Fluxo de Dados

### Entrada (Webhook — Evolution API)
```json
{
  "telefone": "5547XXXXXXXXX",
  "mensagem": "texto da mensagem",
  "nome_morador": "Nome"
}
```

### Saída (Evolution API → WhatsApp)
```json
{
  "resposta": "texto para o morador",
  "agente": "cadastro|chamado|operacional|lead"
}
```

---

## Tabelas Supabase

| Tabela | Descrição |
|---|---|
| `contatos` | Moradores sincronizados do Condfy (com condominio_id) |
| `condominios` | 6 condomínios com decisor, Condfy ID, GC ID, regras JSONB |
| `chamados` | Chamados registrados (8 tipos, prioridade, status, GC ID) |
| `interacoes` | Histórico de conversas por contato (JSONB, 180 dias) |
| `relatorios_semanais` | Log dos relatórios gerados (mensagem + timestamp) |

### Views KPI (public schema)

| View | Usado por |
|---|---|
| `kpi_dashboard` | Dashboard Next.js — linha agregada de resumo |
| `kpi_moradores_por_condo` | Dashboard + Relatório semanal |
| `kpi_chamados_abertos` | Dashboard — tabela de chamados em aberto |
| `kpi_chamados_30d` | Dashboard — área chart 30 dias |
| `kpi_chamados_por_tipo` | Dashboard — donut chart |
| `kpi_atendimentos_7d` | Dashboard — bar chart 7 dias |
| `kpi_status_geral` | Relatório semanal — totais gerais |
| `kpi_chamados_por_condo` | Relatório semanal — chamados por condomínio |

> Para recriar: `curl -X POST http://localhost:5678/webhook/criar-views-kpi -d "{}"`

---

## Sync Diário Condfy

**Horário:** 06:00 (cron)  
**Resultados (última execução — 01/04/2026):** 6 condominios, 734 contatos  
**Duração média:** ~3m45s

```
Cron 06:00 → Login JSF → Parse Condominios (6)
  → UPSERT condominios (Postgres)
  → Scrape Condo Sub-workflow × 6 (paralelo)
    → Scrape moradores → UPSERT contatos
```

---

## Relatório Semanal

**Trigger:** Schedule toda segunda-feira às 09:00 BRT  
**Teste:** `curl -X POST http://localhost:5678/webhook/relatorio-semanal-test -H "Content-Type: application/json" -d "{}"`  
**Saída:** Mensagem WhatsApp formatada (markdown Bold/Italic)  
**Log:** Tabela `relatorios_semanais`  
**Envio WhatsApp:** Node desabilitado — habilitar após Evolution API configurada

```
Schedule/Webhook → Buscar KPIs (Postgres CTE)
  → Formatar Mensagem (Code node)
    ├→ Enviar WhatsApp Gustavo (HTTP — DESABILITADO)
    ├→ Log Relatorio (CREATE TABLE IF NOT EXISTS)
    │     └→ Salvar Log (INSERT)
    └→ Responder Teste (Respond to Webhook)
```

---

## Ambiente de Teste

- **Showroom Condfy:** `condfy_id = 11760`, `imovel_id = 1338843`
- Todos os testes devem ser feitos no Showroom antes de habilitar em produção
- Sub-workflow scrape: `dAZJccR3zMnEjUCM`
