# Mapeamento das Operações Condfy — v4.1

O Condfy usa JSF PrimeFaces. Todas as operações são simulação de browser via HTTP com cookies e ViewState.

**URL Base:** `https://projectexe.acesso.app.br`

---

## Fluxo de Login (padrão para todos os sub-workflows)

```
1. GET /login → extrai ViewState + cookies iniciais
2. POST /login.xhtml
   Headers: Cookie: {cookies_step1}, Faces-Request: partial/ajax
   Body: form=form, form:login={user}, form:senha={pass}, form:captcha=''
         form:logar=form:logar, javax.faces.ViewState={vs}
         javax.faces.partial.ajax=true, javax.faces.source=form:logar
         javax.faces.partial.execute=@all, javax.faces.partial.render=@all
3. Merge cookies (step1 + set-cookie do step2) → usar em todas as requisições
```

**Padrão de merge de cookies:**
```javascript
const map = {};
(prev.cookies + '; ' + newCookies).split('; ').forEach(c => {
  const idx = c.indexOf('=');
  if (idx > 0) {
    const k = c.substring(0, idx).trim();
    const v = c.substring(idx + 1).trim();
    if (k) map[k] = v;
  }
});
const cookies = Object.entries(map).map(([k,v]) => k+'='+v).join('; ');
```

**Extração de ViewState:**
```javascript
const body = item.body || item.data || '';
let viewState = '';
const vsIdx = body.indexOf('javax.faces.ViewState');
if (vsIdx >= 0) {
  const chunk = body.substring(vsIdx, vsIdx + 400);
  const startQ = chunk.indexOf('value="') + 7;
  const endQ = chunk.indexOf('"', startQ);
  if (startQ > 6 && endQ > startQ) viewState = chunk.substring(startQ, endQ);
}
```

---

## Operação 1: Consultar Moradores

**Workflow:** `zjTlC9KhcxC5n0iU`  
**Input:** `{ imovel_id: string }`

**URL:** GET `/imoveis/{imovel_id}/moradores`

**Parse da tabela HTML:**
- Rows: `<tr data-ri="{idx}" data-rk="{rk}">` — `rk` é o ID Condfy do morador
- Nome: `abrirModalFoto('{nome}',` — texto entre aspas
- Telefone: `href="tel:{tel}"` — normalizar para `+55XXXXXXXXXXX`
- Relação: 4º `<td>` do row
- Login status: dentro de `form:dtMoradores:{idx}:j_idt645`

**Output:**
```json
{
  "imovel_id": "1338843",
  "total": 1,
  "moradores": [
    { "idx": 0, "rk": "3123088", "nome": "Matheus De Oliveira", "celular": "...", "tipo": "MORADOR" }
  ]
}
```

---

## Operação 2: Cadastrar Morador (Novo Convite)

**Workflow:** `BtvDTOUItduxjt7t`  
**Input:** `{ imovel_id, nome, celular, tipo }`

**URL:** POST `/moradia/moradores.xhtml`

**Atenção:** A criação usa a rota `/moradia/moradores.xhtml` (não `/imoveis/{id}/moradores`).

**Passo 1:** Selecionar condo na sessão via `/moradia/selecionar.xhtml`

**Campos do form `incluirMorador`:**

| Campo | Descrição |
|---|---|
| `form:nome` | Nome completo (obrigatório) |
| `form:celular` | Celular (obrigatório para convite WhatsApp) |
| `form:tipoConvite` | `WHATSAPP` / `SMS` / `EMAIL` |
| `form:relacaoMorador` | `APENAS_RESPONSAVEL` / `NAO_RESPONSAVEL` |
| `form:relacaoResponsavel` | Descrição/apelido |
| `form:dialogMotivo1:j_idt705` | Motivo (obrigatório) |

**Submit:**
```
javax.faces.source=form:dialogMotivo1:j_idt710
javax.faces.partial.execute=form:incluirMorador form:dialogMotivo1:dialogSalvar
javax.faces.partial.render=form
```

**Resposta de sucesso:** XML parcial com `"Convite criado com sucesso"`

---

## Operação 3: Excluir Morador

**Workflow:** `pqqSU1eo4N1pdrxg`  
**Input:** `{ imovel_id: string, morador_rk: string }`

**Pré-requisito:** Saber o `row_index` do morador (0-based) via consulta prévia.

**Passo 1 — Abrir dialog de exclusão:**
```
javax.faces.source=form:dtMoradores:{row_index}:j_idt678
javax.faces.partial.execute=form:dtMoradores:{row_index}:j_idt678
javax.faces.partial.render=form:dialogMotivo2:dialogExcluir
```
→ Atualizar ViewState da resposta

**Passo 2 — Confirmar com motivo:**
```
javax.faces.source=form:dialogMotivo2:j_idt725
javax.faces.partial.execute=form:dialogMotivo2:dialogExcluir
javax.faces.partial.render=form
form:dialogMotivo2:j_idt720={motivo}
```

**Fluxo completo:**
1. Login
2. GET `/imoveis/{imovel_id}/moradores` → ViewState + encontrar row_index pelo rk
3. POST passo 1 → novo ViewState
4. POST passo 2 com motivo → confirmação

---

## Operação 4: Acesso Temporário (Convidar ao App)

**Workflow:** `5Wn8Mka7zHJPARkR`  
**Input:** `{ imovel_id: string, morador_rk: string, celular: string }`

**URL:** POST `/imoveis/{imovel_id}/moradores`

**Campos do dialog `form:conviteMoradia`:**

| Campo | Valor |
|---|---|
| `form:tipoConvite` | `WHATSAPP` / `SMS` / `EMAIL` |
| `form:morador` | rk do morador (ex: `3123088`) |
| `form:conviteMoradorS` | celular sem formatação (ex: `47933808082`) |
| Botão submit | `form:j_idt796` |

**Abrir dialog:**
```
javax.faces.source=form:j_idt211
javax.faces.partial.render=form:conviteMoradia
```

---

## Showroom de Teste

| Item | Valor |
|---|---|
| Condo ID | `11760` |
| Bloco ID | `73626` |
| Imóvel 1 | `1338843` |
| Imóvel 2 | `1457159` |
| Imóvel 3 | `1338841` |

---

## Notas Importantes

- **Task runner n8n:** `$helpers` e `fetch` NÃO disponíveis em Code nodes. Usar HTTP Request nodes.
- **executeWorkflow:** dados chegam flat no trigger (sem `.body`). Ler com `$input.item.json.campo`.
- **HTTP Request v4.2:** fullResponse retorna dados em `data`, não em `body`.
- **Propagar dados entre nós:** usar spread `{...prev, novoCampo}` para não perder contexto.
- **runOnceForEachItem bug:** usar sempre `runOnceForAllItems` com `$input.all()` loop e `pairedItem: { item: i }` explícito.
