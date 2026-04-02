# ProjectEXE Atendimento WhatsApp v4.1

> Sistema multi-agente de atendimento WhatsApp para síndicos profissionais — Condfy 100% automático via n8n, sem Google Apps Script.

**Autores:** Gustavo Kowacic & Matheus de Oliveira  
**Versão:** 4.1 (31/03/2026)

---

## Stack Tecnológica

| Componente | Tecnologia |
|---|---|
| Canal | WhatsApp Business API Oficial (Meta) |
| Orquestrador | n8n na VPS Locaweb (4GB RAM, 2 vCPU) |
| Banco | Supabase (PostgreSQL) |
| IA Orquestrador | Claude Haiku 4.5 |
| IA Agentes | Claude Sonnet 4 × 4 agentes |
| CRM | Gestão Click |
| App condomínio | Condfy (scraping JSF direto no n8n) |
| Transcrição | Whisper tiny sob demanda na VPS |
| Versionamento | GitHub |

**Custo estimado:** R$ 110–135/mês (com prompt caching: R$ 92–115/mês)

---

## Arquitetura Multi-Agente

```
WhatsApp (API Oficial Meta)
  → Evolution API (VPS)
    → n8n Webhook
      → Haiku Orquestrador (classifica + roteia)
        → Sonnet Cadastro  (coleta dados + consulta Condfy + cadastro automático)
        → Sonnet Chamado   (8 tipos + Gestão Click + consulta/desativação Condfy)
        → Sonnet Lead      (qualificação + GC)
        → Sonnet Operacional (acusar/responder/escalar + acesso temporário Condfy)
```

---

## O que há de Novo na v4.1

- **GAS eliminado** — toda lógica Condfy migrada para n8n direto na VPS
- **4 operações Condfy automáticas** — cadastro, consulta, desativação e acesso temporário
- **Cadastro 100% automático** — zero intervenção humana após aprovação do decisor
- **Canal** — WhatsApp Business API Oficial (Meta) via Evolution API, não mais BotConversa

---

## 4 Operações Condfy Automáticas

| Operação | Agente | Quando |
|---|---|---|
| Cadastrar morador | Sonnet Cadastro | Após aprovação do decisor |
| Consultar status | Sonnet Chamado | Morador pergunta sobre acesso |
| Desativar morador | Sonnet Chamado | Decisor solicita remoção |
| Acesso temporário (convite app) | Sonnet Operacional | Reserva área comum |
| Sync diário (leitura) | Workflow agendado | Todo dia 06:00 |

---

## Fluxo de Cadastro — 10 Etapas Automáticas

1. Haiku detecta intenção de cadastro → roteia para Sonnet Cadastro
2. Coleta: nome, celular, condomínio, unidade
3. Consulta Condfy — morador já existe?
4. Supabase: status `aguardando_aprovacao`
5. Solicita aprovação ao decisor (3 tentativas, janela 7h–22h SP)
6. n8n cadastra morador no Condfy automaticamente via scraping JSF
7. Confirma cadastro bem-sucedido no Condfy
8. Envia PDF manual + vídeo tutorial (facial self-service)
9. Confirma ao morador: acesso pronto
10. Supabase: status `concluido` + tags atualizadas

---

## Tabelas Supabase

| Tabela | Descrição |
|---|---|
| `contatos` | Moradores (telefone, nome, email, condominio_id, unidade, papel, tags) |
| `condominios` | 6 condomínios (decisor, Condfy ID, GC ID, regras JSONB) |
| `chamados` | 8 tipos de chamado + prioridade + status + GC ID |
| `interacoes` | Histórico de conversas (retidas por 180 dias) |

---

## Estrutura do Repositório

```
prompts/
  haiku-orquestrador.md      # Classificador e roteador
  sonnet-cadastro.md         # Agente de cadastro Condfy
  sonnet-chamado.md          # Agente de chamados + Gestão Click
  sonnet-lead.md             # Agente de qualificação de leads
  sonnet-operacional.md      # Agente operacional (reservas, emergências)

docs/
  workflows.md               # IDs e arquitetura dos workflows n8n
  condfy-mapeamento.md       # Mapeamento técnico das operações JSF Condfy

dashboard/                   # Next.js — KPIs e gestão (em desenvolvimento)
```

---

## Roadmap (14 etapas)

| Fase | Etapas | Status |
|---|---|---|
| Infra | 1–5 (VPS, Whisper, Supabase, GitHub, WhatsApp API) | Em andamento |
| Fluxos | 6 (Condfy sync diário) | ✅ Concluído |
| Fluxos | 7 (4 operações Condfy escrita) | ✅ Concluído |
| Fluxos | 8–12 (Agentes + orquestrador) | ✅ Workflows criados |
| Go-live | 13–14 (Prompts + testes + dashboard) | Em andamento |

---

## Condomínios Atendidos

6 condomínios em Santa Catarina (Showroom = ID 11760 para testes).
