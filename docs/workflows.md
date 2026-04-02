# ProjectEXE Atendimento WhatsApp — Workflows n8n

## Arquitetura

```
WhatsApp (BotConversa)
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

### Sub-workflows Condfy

| Workflow | ID | Status | Testado |
|----------|-----|--------|--------|
| condfy-consultar | `zjTlC9KhcxC5n0iU` | Ativo | ✅ |
| condfy-excluir | `pqqSU1eo4N1pdrxg` | Ativo | — |
| condfy-cadastrar | `BtvDTOUItduxjt7t` | Ativo | — |
| condfy-convidar | `5Wn8Mka7zHJPARkR` | Ativo | ✅ |

### Workflows de Suporte

| Workflow | ID | Status |
|----------|-----|--------|
| Sync diário Condfy | `a5EU8tNlYkfrjojl` | Ativo |
| Util carga inicial | `Z0xYUOp0EmWVx9uv` | Inativo |

## Credenciais n8n

| Credencial | ID |
|-----------|----|
| Supabase (Postgres) | `GQfB9He6oEKDaFkx` |
| Anthropic | `i4lndXDTCgIBR0A0` |

## Fluxo de Dados

### Entrada (Webhook)
```json
{
  "telefone": "5547XXXXXXXXX",
  "mensagem": "texto da mensagem",
  "condominio_id": "uuid",
  "nome_morador": "Nome"
}
```

### Saída (BotConversa)
```json
{
  "resposta": "texto para o morador",
  "agente": "cadastro|chamado|operacional|lead"
}
```

## Tabelas Supabase

- `condominios` — dados dos 6 condomínios
- `moradores` — moradores sincronizados do Condfy
- `chamados` — chamados registrados
- `interacoes_sessao` — histórico de conversas por telefone (JSONB)
- `leads` — leads qualificados

## Ambiente de Teste

- **Showroom Condfy:** `condfy_id = 11760`, `imovel_id = 1338843`
- Todos os testes devem ser feitos no Showroom antes de habilitar em produção
