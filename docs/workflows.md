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

| Workflow | ID | Status |
|---|---|---|
| Sync diário Condfy → Supabase | `a5EU8tNlYkfrjojl` | Ativo |
| Scrape Condo (sub) | `dAZJccR3zMnEjUCM` | Ativo |
| Util criar views KPI | `wXGAyH6DilJA22Gx` | Pendente execução |

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

> Views de KPIs criadas via workflow util (`wXGAyH6DilJA22Gx`).

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

## Ambiente de Teste

- **Showroom Condfy:** `condfy_id = 11760`, `imovel_id = 1338843`
- Todos os testes devem ser feitos no Showroom antes de habilitar em produção
- Sub-workflow scrape: `dAZJccR3zMnEjUCM`
