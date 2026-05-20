# Dossiê SOLID + Strategy Pattern — Projeto Kadu

---

## S — Single Responsibility Principle
> Cada módulo, classe ou função deve ter uma única razão para mudar.

---

### S.1 · `grades.ts` — módulo exclusivo de lógica de notas

**Arquivo:** `frontend/src/lib/grades.ts:1–19`

```typescript
export function corNota(nota: number | null): string {
  if (nota === null) return 'text-gray-400'
  if (nota >= 9) return 'text-green-600'
  if (nota >= 6) return 'text-blue-600'
  return 'text-red-600'
}

export type StatusNota = 'Aprovado' | 'Reprovado' | 'Pendente'

export function statusNota(media: number | null): StatusNota {
  if (media === null) return 'Pendente'
  return media >= 6 ? 'Aprovado' : 'Reprovado'
}

export function varianteBadge(status: StatusNota): 'default' | 'secondary' | 'destructive' {
  if (status === 'Aprovado') return 'default'
  if (status === 'Pendente') return 'secondary'
  return 'destructive'
}
```

**Por quê:** O módulo tem uma razão para mudar — a regra pedagógica de aprovação. Antes desse módulo existir, a lógica de cor estava duplicada em `Boletim.tsx`, `NotasLancamento.tsx` e `DetalhesTurma.tsx`, cada um com limiares diferentes. Hoje qualquer alteração no limiar propaga automaticamente para todas as telas.

---

### S.2 · `auth.js` (middleware) — única responsabilidade: validar JWT

**Arquivo:** `backend/middleware/auth.js:7–16`

```javascript
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' })
  try {
    req.user = AuthService.verificarToken(token)
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado' })
  }
}
```

**Por quê:** O middleware faz apenas uma coisa — extrair e validar o token JWT. Nenhuma lógica de negócio, nenhuma query. As rotas não precisam saber como um token é verificado.

---

### S.3 · `AuthService.js` — lógica de autenticação isolada de HTTP

**Arquivo:** `backend/services/AuthService.js:12–25`

```javascript
const AuthService = {
  login(email, senha) {
    const prof = ProfessorRepository.findByEmail(email)
    if (!prof || !bcrypt.compareSync(senha, prof.senha_hash)) return null
    const token = jwt.sign(
      { id: prof.id, email: prof.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    return { token, professor: { id: prof.id, nome: prof.nome, email: prof.email } }
  },

  verificarToken(token) {
    return jwt.verify(token, JWT_SECRET)
  },
}
```

**Por quê:** Lógica de autenticação pura, sem dependência de `req`/`res`. Pode ser reutilizada em CLI, webhooks ou testes sem mockar HTTP.

---

### S.4 · `NotaRepository.js` — exclusivo de acesso a dados de notas

**Arquivo:** `backend/repositories/NotaRepository.js:6–55`

```javascript
const NotaRepository = {
  findByAluno(alunoId) {
    return plainAll(db.prepare(`
      SELECT n.*, t.disciplina AS materia, t.nome AS turmaNome
      FROM notas_bimestrais n
      JOIN turmas t ON t.id = n.turma_id
      WHERE n.aluno_id = ?
      ORDER BY t.disciplina
    `).all(alunoId))
  },

  upsert({ alunoId, turmaId, materia, bimestre1, bimestre2, bimestre3, bimestre4 }) {
    db.prepare(`
      INSERT INTO notas_bimestrais (aluno_id, turma_id, materia, bimestre1, bimestre2, bimestre3, bimestre4)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(aluno_id, turma_id) DO UPDATE SET
        bimestre1 = excluded.bimestre1, bimestre2 = excluded.bimestre2,
        bimestre3 = excluded.bimestre3, bimestre4 = excluded.bimestre4
    `).run(alunoId, turmaId, materia ?? '', bimestre1 ?? null,
           bimestre2 ?? null, bimestre3 ?? null, bimestre4 ?? null)
    return this.findByTurmaAndAluno(turmaId, alunoId)
  },
}
```

**Por quê:** 100% camada de acesso a dados. Sem validação, sem cálculo de média, sem lógica de negócio. Trocar SQLite por PostgreSQL exige alterar apenas este arquivo.

---

### S.5 · Custom hooks — cada hook gerencia um único domínio

**Arquivo:** `frontend/src/hooks/index.ts:10–56`

```typescript
export function useDashboard() {
  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    api.get<DashboardData>('/dashboard')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

export function useTurma(id: string | undefined) {
  const [turma, setTurma]     = useState<Turma | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.get<Turma>(`/turmas/${id}`)
      .then(setTurma)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return { turma, loading, error }
}
```

**Por quê:** Cada hook gerencia o ciclo de vida de um único recurso. As páginas apenas renderizam — não sabem como buscar dados. Os hooks são testáveis de forma independente.

---

## O — Open/Closed Principle
> Aberto para extensão, fechado para modificação.

---

### O.1 · `AtividadeRepository.js` — filtros dinâmicos sem modificar a função

**Arquivo:** `backend/repositories/AtividadeRepository.js:7–19`

```javascript
findAll({ turmaId, status } = {}) {
  const where  = []
  const params = []
  if (turmaId) { where.push('a.turma_id = ?'); params.push(turmaId) }
  if (status)  { where.push('a.status = ?');   params.push(status)  }
  const sql = `
    SELECT a.*, t.nome AS turmaNome FROM atividades a
    JOIN turmas t ON t.id = a.turma_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY a.data_entrega ASC
  `
  return plainAll(db.prepare(sql).all(...params))
}
```

**Por quê:** Adicionar um novo filtro (ex.: `professorId`) é uma extensão via parâmetro — não modifica o corpo do método nem quebra chamadas existentes.

---

### O.2 · `PresencaRepository.js` — mesmo padrão extensível de filtros

**Arquivo:** `backend/repositories/PresencaRepository.js:7–15`

```javascript
findAll({ turmaId, data, alunoId } = {}) {
  const where  = []
  const params = []
  if (turmaId) { where.push('turma_id = ?'); params.push(turmaId) }
  if (data)    { where.push('data = ?');     params.push(data)    }
  if (alunoId) { where.push('aluno_id = ?'); params.push(alunoId) }
  const sql = `SELECT * FROM registros_presenca${
    where.length ? ' WHERE ' + where.join(' AND ') : ''
  }`
  return plainAll(db.prepare(sql).all(...params))
}
```

**Por quê:** Rotas chamam `findAll({turmaId})`, `findAll({alunoId, data})`, qualquer combinação. O método aceita novas combinações sem alterar seu código.

---

### O.3 · `grades.ts` + `Boletim.tsx` — exibição fechada, regras abertas

**Arquivo:** `frontend/src/pages/Boletim.tsx:129–158`

```typescript
const media = calcularMedia(nota)
const stat  = statusNota(media)
const fmt   = (v: number | null) => v !== null ? v.toFixed(1) : '—'

return (
  <tr key={nota.id} className="border-b hover:bg-gray-50">
    <td className="py-3 px-4 font-medium">{nota.materia}</td>
    {[nota.bimestre1, nota.bimestre2, nota.bimestre3, nota.bimestre4].map((v, i) => (
      <td key={i} className="text-center py-3 px-4">
        <span className={`font-semibold ${corNota(v)}`}>{fmt(v)}</span>
      </td>
    ))}
    <td className="text-center py-3 px-4">
      <span className={`font-bold text-lg ${corNota(media)}`}>{fmt(media)}</span>
    </td>
    <td className="text-center py-3 px-4">
      <Badge variant={varianteBadge(stat)}>{stat}</Badge>
    </td>
  </tr>
)
```

**Por quê:** O componente `Boletim` está fechado para modificação. Alterar o limiar de cor ou adicionar um novo status (ex.: "Em Recuperação") exige apenas mudar `grades.ts` — o Boletim não é tocado.

---

## L — Liskov Substitution Principle
> Subtipos devem poder substituir seus tipos base sem alterar o comportamento do programa.

---

### L.1 · Repositórios intercambiáveis

**Arquivo:** `backend/repositories/AlunoRepository.js:7–33`

```javascript
const AlunoRepository = {
  findAll(professorId) { ... },
  findByTurma(turmaId) { ... },
  findById(id) { ... },
}
```

**Arquivo:** `backend/repositories/TurmaRepository.js:5–24`

```javascript
const TurmaRepository = {
  findAll(professorId) { ... },
  findById(id, professorId) { ... },
  findAlunosByTurma(turmaId) { ... },
}
```

**Por quê:** Ambos os repositórios expõem `findAll()` e `findById()` com o mesmo contrato. Código de rota que chama `repo.findAll(req.user.id)` funciona com qualquer um dos dois sem alteração.

---

### L.2 · Cadeia de middlewares com assinatura uniforme

**Arquivo:** `backend/routes/notas.js:8`, `backend/routes/alunos.js:8`, `backend/routes/turmas.js:8`

```javascript
// notas.js
router.get('/', auth, (req, res) => { ... })
router.post('/', auth, (req, res) => { ... })

// alunos.js
router.get('/', auth, (req, res) => { ... })
router.delete('/:id', auth, (req, res) => { ... })

// turmas.js
router.get('/', auth, (req, res) => { ... })
```

**Por quê:** O middleware `auth` tem assinatura `(req, res, next)`. Pode ser substituído por `rateLimiter` ou `logger` sem alterar nenhuma rota — todos conformam com o contrato do Express.

---

### L.3 · Custom hooks com retorno uniforme

**Arquivo:** `frontend/src/hooks/index.ts:10–56`

```typescript
export function useDashboard() { return { data,   loading, error } }
export function useTurmas()    { return { turmas, loading, error } }
export function useTurma(id)   { return { turma,  loading, error } }
export function useAlunos()    { return { alunos, loading, error } }
export function useBoletim()   { return { notas,  loading        } }
```

**Por quê:** Todas as páginas esperam o mesmo formato `{ data, loading, error }`. Trocar `useTurmas()` por `useAlunos()` em um componente não quebra o tratamento de `loading` ou `error` — Liskov garantido.

---

## I — Interface Segregation Principle
> Clientes não devem ser forçados a depender de interfaces que não utilizam.

---

### I.1 · `NotaBimestral` — interface enxuta com apenas o necessário

**Arquivo:** `frontend/src/types/index.ts:38–48`

```typescript
export interface NotaBimestral {
  id?: number
  aluno_id: string
  turma_id: string
  materia?: string
  turmaNome?: string
  bimestre1: number | null
  bimestre2: number | null
  bimestre3: number | null
  bimestre4: number | null
}
```

**Por quê:** A função `calcularMedia()` precisa apenas de `bimestre1..4`. Não é forçada a receber um objeto `Aluno` completo com matrícula, série, turmas vinculadas, etc. Interface segmentada para o que cada consumidor realmente usa.

---

### I.2 · `ProfessorRepository.js` — apenas os métodos que o AuthService consome

**Arquivo:** `backend/repositories/ProfessorRepository.js:8–15`

```javascript
const ProfessorRepository = {
  findByEmail(email) {
    return plain(
      db.prepare('SELECT * FROM professores WHERE email = ?').get(email)
    )
  },
  findById(id) {
    return plain(
      db.prepare('SELECT id, nome, email, created_at FROM professores WHERE id = ?').get(id)
    )
  },
}
```

**Por quê:** O `AuthService` precisa apenas de `findByEmail()` e `findById()`. Não existe `update()`, `delete()` ou `findAll()` forçado nessa interface — apenas o que os clientes realmente usam.

---

### I.3 · Rota de notas — desestrutura somente os campos necessários

**Arquivo:** `backend/routes/notas.js:21–27`

```javascript
router.post('/', auth, (req, res) => {
  const { alunoId, turmaId, bimestre1, bimestre2, bimestre3, bimestre4 } = req.body
  if (!alunoId || !turmaId)
    return res.status(400).json({ erro: 'alunoId e turmaId obrigatórios' })
  const turma = TurmaRepository.findById(turmaId, req.user.id)
  const nota  = repo.upsert({
    alunoId, turmaId,
    materia: turma?.disciplina,
    bimestre1, bimestre2, bimestre3, bimestre4
  })
  res.json(nota)
})
```

**Por quê:** O handler declara explicitamente os 6 campos que usa. Campos extras no `req.body` são ignorados. O repositório recebe apenas o que precisa para o `upsert` — sem objetos gordos passados inteiros.

---

## D — Dependency Inversion Principle
> Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.

---

### D.1 · `NotaService.js` depende do repositório, não do SQL

**Arquivo:** `backend/services/NotaService.js:2–42`

```javascript
const NotaRepository = require('../repositories/NotaRepository')

function calcularMedia(vals) {
  if (!vals.length) return 0
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
}

const NotaService = {
  mediaAlunoPorTurma(alunoId, turmaId) {
    const nota = NotaRepository.findByTurmaAndAluno(turmaId, alunoId)
    if (!nota) return 0
    const vals = [nota.bimestre1, nota.bimestre2, nota.bimestre3, nota.bimestre4]
      .filter(v => v !== null)
    return calcularMedia(vals)
  },

  mediaTurma(turmaId) {
    const notas = NotaRepository.findByTurmaRaw(turmaId)
    const vals  = notas.flatMap(n =>
      [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
    )
    return calcularMedia(vals)
  },
}
```

**Por quê:** `NotaService` depende de `NotaRepository` (abstração de acesso a dados), não de queries SQL diretas. Trocar SQLite por PostgreSQL exige alterar apenas o repositório — o serviço não muda.

---

### D.2 · Rotas dependem do `NotaService`, não do repositório

**Arquivo:** `backend/routes/turmas.js:8–31`

```javascript
router.get('/', auth, (req, res) => {
  const turmas = repo.findAll(req.user.id)
  res.json(turmas.map(t => ({
    ...t,
    media: NotaService.mediaTurma(t.id)
  })))
})

router.get('/:id', auth, (req, res) => {
  const turma  = repo.findById(req.params.id, req.user.id)
  if (!turma) return res.status(404).json({ erro: 'Turma não encontrada' })
  const alunos = repo.findAlunosByTurma(req.params.id)
    .map(a => ({
      ...a,
      mediaNotas: NotaService.mediaAlunoPorTurma(a.id, req.params.id)
    }))
  res.json({ ...turma, media: NotaService.mediaTurma(req.params.id), alunos })
})
```

**Por quê:** A rota invoca `NotaService.mediaTurma()`, não `NotaRepository` diretamente. Se o algoritmo de cálculo mudar (ex.: média ponderada), apenas o serviço é alterado — as rotas não são tocadas.

---

### D.3 · Páginas React dependem do cliente `api`, não do `fetch`

**Arquivo:** `frontend/src/pages/Turmas.tsx:69–72`

```typescript
useEffect(() => {
  api.get<Turma[]>('/turmas')
    .then(setTurmas)
    .catch(() => setErro('Erro ao carregar turmas. Tente novamente.'))
    .finally(() => setCarregando(false))
}, [])
```

**Arquivo:** `frontend/src/lib/api.ts:14–34`

```typescript
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: getHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
  if (res.status === 401) {
    localStorage.clear()
    window.location.href = '/login'
    throw new Error('Não autorizado')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.erro || `Erro ${res.status}`)
  return data as T
}
```

**Por quê:** As páginas dependem da abstração `api.get()` — não sabem que por baixo é `fetch`. Trocar `fetch` por `axios`, adicionar interceptors ou mockar nos testes exige alterar apenas `api.ts`.

---

## Strategy Pattern
> Encapsula algoritmos intercambiáveis; o comportamento é selecionado em tempo de execução sem alterar o cliente.

---

### Strategy.1 · `grades.ts` como estratégias de exibição de notas

**Arquivo:** `frontend/src/lib/grades.ts:1–19`

```typescript
// Estratégia de cor
export function corNota(nota: number | null): string {
  if (nota === null) return 'text-gray-400'
  if (nota >= 9) return 'text-green-600'
  if (nota >= 6) return 'text-blue-600'
  return 'text-red-600'
}

// Estratégia de status
export function statusNota(media: number | null): StatusNota {
  if (media === null) return 'Pendente'
  return media >= 6 ? 'Aprovado' : 'Reprovado'
}

// Estratégia de variante de badge
export function varianteBadge(status: StatusNota): 'default' | 'secondary' | 'destructive' {
  if (status === 'Aprovado') return 'default'
  if (status === 'Pendente') return 'secondary'
  return 'destructive'
}
```

**Consumidor — `Boletim.tsx:136–158`:**

```typescript
<span className={`font-semibold ${corNota(v)}`}>{fmt(v)}</span>
<Badge variant={varianteBadge(stat)}>{stat}</Badge>
```

**Consumidor — `NotasLancamento.tsx:170,173`:**

```typescript
<div className={`text-3xl font-bold ${corNota(media)}`}>{media ?? '—'}</div>
<span className={corNota(media)}>{stat}</span>
```

**Por quê:** Três estratégias de exibição plugadas pelos componentes em tempo de execução. Nenhum componente hardcoda cores ou limiares. Trocar a estratégia (ex.: adicionar faixa "Excelente" ≥ 9.5) altera apenas `grades.ts` — todos os consumidores se beneficiam automaticamente.

---

### Strategy.2 · `NotaService.js` — estratégias de escopo de cálculo de média

**Arquivo:** `backend/services/NotaService.js:9–42`

```javascript
// Estratégia: média de um aluno em uma turma específica
mediaAlunoPorTurma(alunoId, turmaId) {
  const nota = NotaRepository.findByTurmaAndAluno(turmaId, alunoId)
  const vals = [nota.bimestre1, nota.bimestre2, nota.bimestre3, nota.bimestre4]
    .filter(v => v !== null)
  return calcularMedia(vals)
},

// Estratégia: média de um aluno em todas as turmas
mediaAluno(alunoId) {
  const notas = NotaRepository.findByAlunoRaw(alunoId)
  const vals  = notas.flatMap(n =>
    [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
  )
  return calcularMedia(vals)
},

// Estratégia: média de toda uma turma
mediaTurma(turmaId) {
  const notas = NotaRepository.findByTurmaRaw(turmaId)
  const vals  = notas.flatMap(n =>
    [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
  )
  return calcularMedia(vals)
},

// Estratégia: média geral do sistema
mediaGeral() {
  const notas = NotaRepository.findAllRaw()
  const vals  = notas.flatMap(n =>
    [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
  )
  return calcularMedia(vals)
},
```

**Por quê:** Todas as estratégias usam a mesma função `calcularMedia()`, mas cada uma seleciona um escopo de dados diferente em tempo de execução. Adicionar uma nova estratégia (ex.: `mediaPorBimestre`) não altera as existentes.

---

### Strategy.3 · AlertDialog com estratégia de deleção plugável

**Turmas.tsx — estratégia de deletar turma (`backend/routes/turmas.js:DELETE`):**

```typescript
// frontend/src/pages/Turmas.tsx:75–93
const confirmarDelecao = async () => {
  if (!turmaParaDeletar) return
  setDeletando(true)
  try {
    await api.delete(`/turmas/${turmaParaDeletar.id}`)
    setTurmas(prev => prev.filter(t => t.id !== turmaParaDeletar.id))
    toast.success('Turma excluída com sucesso!')
  } catch {
    toast.error('Erro ao excluir turma. Tente novamente.')
  } finally {
    setDeletando(false)
    setTurmaParaDeletar(null)
  }
}
```

**Alunos.tsx — mesma estrutura, estratégia de deletar aluno:**

```typescript
// frontend/src/pages/Alunos.tsx:81–99
const confirmarDelecao = async () => {
  if (!alunoParaDeletar) return
  setDeletando(true)
  try {
    await api.delete(`/alunos/${alunoParaDeletar.id}`)
    setAlunos(prev => prev.filter(a => a.id !== alunoParaDeletar.id))
    toast.success('Aluno excluído com sucesso!')
  } catch {
    toast.error('Erro ao excluir aluno. Tente novamente.')
  } finally {
    setDeletando(false)
    setAlunoParaDeletar(null)
  }
}
```

**Template do AlertDialog — idêntico nas duas páginas:**

```typescript
// frontend/src/pages/Turmas.tsx:170–191
<AlertDialog
  open={!!turmaParaDeletar}
  onOpenChange={open => { if (!open) setTurmaParaDeletar(null) }}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Excluir turma</AlertDialogTitle>
      <AlertDialogDescription>
        Tem certeza que deseja excluir a turma{' '}
        <strong>"{turmaParaDeletar?.nome}"</strong>?
        Esta ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={deletando}>Cancelar</AlertDialogCancel>
      <AlertDialogAction
        className={buttonVariants({ variant: 'destructive' })}
        onClick={confirmarDelecao}
        disabled={deletando}>
        {deletando ? 'Excluindo...' : 'Excluir'}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Por quê:** O diálogo visual é genérico — o handler `confirmarDelecao` é a estratégia que muda entre páginas. Adicionar uma terceira tela (ex.: "Excluir Atividade") replica o padrão sem alterar o `AlertDialog`.

---

### Strategy.4 · `AtividadeRepository.findAll()` — estratégia de query por filtros

**Arquivo:** `backend/repositories/AtividadeRepository.js:7–19`

```javascript
findAll({ turmaId, status } = {}) {
  const where  = []
  const params = []
  if (turmaId) { where.push('a.turma_id = ?'); params.push(turmaId) }
  if (status)  { where.push('a.status = ?');   params.push(status)  }
  const sql = `
    SELECT a.*, t.nome AS turmaNome FROM atividades a
    JOIN turmas t ON t.id = a.turma_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY a.data_entrega ASC
  `
  return plainAll(db.prepare(sql).all(...params))
}
```

**Rota consumidora — `backend/routes/atividades.js:7–9`:**

```javascript
router.get('/', auth, (req, res) => {
  res.json(repo.findAll(req.query))
})
```

**Por quê:** A rota delega ao repositório qual estratégia de filtro aplicar. `findAll({turmaId})`, `findAll({status: 'ativa'})`, `findAll({turmaId, status})` — comportamentos diferentes, método único. Nenhuma alteração no código da rota.

---

## Resumo Executivo

| Princípio | Ocorrências | Arquivo(s) principal(is) |
|-----------|-------------|--------------------------|
| **S** — Single Responsibility | 5 | `grades.ts`, `auth.js`, `AuthService.js`, `NotaRepository.js`, `hooks/index.ts` |
| **O** — Open/Closed | 3 | `AtividadeRepository.js`, `PresencaRepository.js`, `Boletim.tsx` + `grades.ts` |
| **L** — Liskov Substitution | 3 | Repositórios, middlewares Express, custom hooks |
| **I** — Interface Segregation | 3 | `types/index.ts`, `ProfessorRepository.js`, `routes/notas.js` |
| **D** — Dependency Inversion | 3 | `NotaService.js`, `routes/turmas.js`, `api.ts` + páginas |
| **Strategy** | 4 | `grades.ts`, `NotaService.js`, AlertDialog (`Turmas`/`Alunos`), `AtividadeRepository.js` |

> **Ponto de ancoragem central:** `grades.ts` toca quatro dos seis itens — exemplifica S (módulo de responsabilidade única), O (componentes fechados para modificação), D (componentes dependem da abstração, não de limiares hardcoded) e Strategy (algoritmos de cor/status selecionados em runtime).
