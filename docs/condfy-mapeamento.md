# Mapeamento das Operações Condfy

O Condfy usa JSF PrimeFaces com scraping via HTTP. Todas as operações seguem o padrão:
1. GET na página do imóvel → extrai ViewState + cookies
2. POST AJAX com `Faces-Request: partial/ajax` → executa ação

## Padrão de Cookie Propagation

```javascript
// Merge cookies de múltiplas respostas
const map = {};
(prev.cookies + '; ' + newCookies).split('; ').forEach(c => {
  const idx = c.indexOf('=');
  if (idx > 0) {
    const k = c.substring(0,idx).trim();
    const v = c.substring(idx+1).trim();
    if (k) map[k] = v;
  }
});
const cookies = Object.entries(map).map(([k,v]) => k+'='+v).join('; ');
```

## Padrão de Extração de ViewState

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

## URL Base

```
https://app.condfy.com.br/imovel/{imovel_id}.jsf
```

## Operação: Consultar Moradores

**Workflow:** `zjTlC9KhcxC5n0iU`

**Input:** `{ imovel_id: string }`

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

**Fluxo:**
1. GET `/imovel/{imovel_id}.jsf` → extrai ViewState + cookies
2. POST AJAX para abrir aba de moradores → extrai lista HTML
3. Parse da lista → retorna JSON estruturado

## Operação: Excluir Morador

**Workflow:** `pqqSU1eo4N1pdrxg`

**Input:** `{ imovel_id: string, morador_rk: string }`

**Fluxo:**
1. GET página → ViewState + cookies
2. POST AJAX abrir aba moradores
3. POST AJAX clicar excluir no morador (usando rk)
4. POST AJAX confirmar exclusão

## Operação: Cadastrar Morador

**Workflow:** `BtvDTOUItduxjt7t`

**Input:** `{ imovel_id: string, nome: string, celular: string, tipo: string }`

**Fluxo:**
1. GET página → ViewState + cookies
2. POST AJAX abrir aba moradores
3. POST AJAX abrir form de novo morador
4. POST AJAX preencher e salvar dados

## Operação: Convidar Morador (WhatsApp)

**Workflow:** `5Wn8Mka7zHJPARkR`

**Input:** `{ imovel_id: string, morador_rk: string, celular: string }`

**Dialog campos:**
- `form:tipoConvite` — radio: `WHATSAPP` | `SMS` | `EMAIL`
- `form:morador` — select com valor = rk do morador
- `form:conviteMoradorS` — campo celular (formato 47XXXXXXXXX)
- Botão submit: `form:j_idt796`
- Abrir dialog: source=`form:j_idt211`, render=`form:conviteMoradia`

**Fluxo:**
1. GET página → ViewState + cookies
2. POST AJAX abrir dialog de convite
3. POST AJAX preencher tipo (WHATSAPP)
4. POST AJAX selecionar morador
5. POST AJAX preencher celular
6. POST AJAX submit → envio do convite

## Notas Importantes

- **Task runner n8n:** `$helpers`, `fetch` e referências cross-node NÃO disponíveis em Code nodes de sub-workflows. Usar HTTP Request nodes para chamadas HTTP.
- **executeWorkflow:** dados chegam flat no trigger do sub-workflow (sem `.body`). Ler com `$input.item.json.campo` diretamente.
- **Propagar dados:** sempre usar spread `{...prev, novoCampo}` em cada Code node para não perder dados anteriores.
