# ProjectEXE Atendimento WhatsApp — Workflows n8n

## Arquitetura

```
WhatsApp (BotConversa / Evolution API)
    ↓
Webhook n8n
    ↓
[Orquestrador Haiku] — classifica mensagem
    ↓
[Agente Sonnet especialista] — responde + emite tags de ação
    ↓
[Parser de tags] — executa ações via sub-workflows
    ↓
Resposta ao morador
```

## IDs dos Workflows

### Workflows Principais

| Workflow | ID | Status |
|----------|-----|--------|
| Orquestrador Haiku | `gff6jdJlaHVffagk` | Ativo |
| Agente Cadastro | `Kwvtjmoh4prm7OlA` | Ativo |
| Agente Chamado | `ktzZOHsJie08H5PR` | Ativo |
| Agente Lead | `EncZOoqh4guBZK3r` | Ativo |
| Agente Operacional | `pNM9Yez5y1RUeD0z` | Ativo |
| Relatório Semanal | `kYrNrGKMHQyqCXu9` | Ativo |

### Sub-workflows Condfy

| Workflow | ID | Status | Testado |
|----------|-----|--------|---------|
| condfy-consultar | `zjTlC9KhcxC5n0iU` | Ativo | ✅ |
| condfy-excluir | `pqqSU1eo4N1pdrxg` | Ativo | — |
| condfy-cadastrar | `BtvDTOUItduxjt7t` | Ativo | — |
| condfy-convidar | `5Wn8Mka7zHJPARkR` | Ativo | ✅ |

### Workflows de Suporte

| Workflow | ID | Status |
|----------|-----|--------|
| Sync diário Condfy | `a5EU8tNlYkfrjojl` | Ativo |
| util-check-schema | `ovgRfJvOHAIlEBXE` | Inativo |
| util-criar-views-kpi | `wXGAyH6DilJA22Gx` | Inativo |

## Credenciais n8n

| Credencial | ID |
|-----------|---|
| Supabase (Postgres) | `GQfB9He6oEKDaFkx` |
| Anthropic | `i4lndXDTCgIBR0A0` |

## Tabelas Supabase

| Tabela | Descrição |
|--------|----------|
| `condominios` | 6 condos + showroom |
| `contatos` | 735 moradores sincronizados do Condfy |
| `chamados` | Chamados registrados pelos agentes |
| `interacoes_sessao` | Histórico de conversas por telefone (JSONB) |
| `relatorios_semanais` | Logs dos relatórios gerados |

## Views KPI (Supabase)

| View | Colunas principais |
|------|-------------------|
| `kpi_dashboard` | total_contatos, chamados_abertos, chamados_hoje, taxa_resolucao |
| `kpi_status_geral` | total_condominios, total_contatos, chamados_abertos, urgentes |
| `kpi_moradores_por_condo` | condominio_nome, total_moradores |
| `kpi_chamados_por_condo` | condominio, em_aberto, alta_prioridade, ultimos_30d |
| `kpi_chamados_abertos` | id, tipo, prioridade, condominio_nome, status |
| `kpi_chamados_por_categoria` | tipo, total, alta, em_aberto, avg_horas_resolucao |
| `kpi_chamados_por_tipo` | tipo, total |
| `kpi_chamados_30d` | data, total |
| `kpi_atendimentos_7d` | data, total |
| `kpi_atividade_semanal` | dia, total_interacoes, contatos_unicos |

## Workflow Relatório Semanal

**ID:** `kYrNrGKMHQyqCXu9`

**Trigger produção:** Schedule — toda segunda-feira às 9h BRT

**Trigger teste:** `POST http://localhost:5678/webhook/relatorio-semanal-test`

**Saída gerada (exemplo real — 02/04/2026):**
```
📊 *Relatório Semanal ProjectEXE*
_26/03/2026 a 02/04/2026_

*Visão Geral:*
• Total moradores: 735
• Chamados em aberto: 0
• Urgentes: 0
• Novos na semana: 0

*Por Condomínio:*
• Pharol do Porto: 238 moradores, 0 abertos
• Lotisa Classic: 174 moradores, 0 abertos
• Workhub Coworking: 164 moradores, 0 abertos
• San Marino Residence: 90 moradores, 0 abertos
• Ethima: 58 moradores, 0 abertos
• Infinitá Tree House: 11 moradores, 0 abertos

*Atendimentos WhatsApp (7d): 0*
```

**Envio WhatsApp:** node `Enviar WhatsApp Gustavo` está DESABILITADO.
Habilitar após configurar Evolution API e substituir `EVOLUTION_API_KEY_AQUI` pela chave real.

## Ambiente de Teste

- **Showroom Condfy:** `condfy_id = 11760`, `imovel_id = 1338843`
- Todos os testes feitos no Showroom antes de habilitar em produção

## Próximos Passos (Go-live)

1. **Vercel** — conectar repo em vercel.com/new, root dir: `dashboard`, env: `SUPABASE_ANON_KEY`
2. **Evolution API** — instalar na VPS, escanear QR, configurar webhook → Orquestrador Haiku
3. **Habilitar WhatsApp no relatório semanal** — trocar API key e ativar o node
4. **Testes end-to-end** — enviar mensagem real e validar fluxo completo
