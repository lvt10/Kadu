# Estrutura de Sprints — Jira · Projeto Kadu

## Visão Geral

| Campo | Valor |
|-------|-------|
| Projeto | Kadu — Sistema de Gerenciamento Escolar |
| Stack | React + TypeScript + Tailwind / Node.js + Express + SQLite |
| Metodologia | Scrum acadêmico (sprints de 2 semanas) |
| Escala de pontos | Fibonacci (1, 2, 3, 5, 8, 13) |

---

## Sprint 1 — "Fundação" (Concluída)

**Escopo:** Setup do projeto, autenticação completa (registro com código de e-mail, login JWT, reset de senha), CRUD de Turmas e Alunos, estrutura de rotas protegidas, layout com sidebar responsiva.

---

## Sprint 2 — "Experiência do Professor"

**Objetivo:** Entregar as funcionalidades de gestão pedagógica (notas, boletim, dashboard) com qualidade de UX, e elevar a qualidade interna do código por meio de refatorações baseadas em SOLID.

**Total de pontos:** 34

---

### Épico: KADU-E2 — Gestão Pedagógica & Qualidade de UX

---

### KADU-20 — Dashboard com Visão Geral · `5 pts`

**Como** professor, **quero** ver um painel com as principais métricas ao fazer login, **para que** eu avalie rapidamente o estado das minhas turmas sem navegar por múltiplas páginas.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | Exibe: total de alunos, atividades ativas, taxa de presença do dia e média geral de notas |
| CA-2 | Gráfico de barras com distribuição de notas por faixa |
| CA-3 | Lista de próximas atividades com nome da turma e contador de dias restantes |
| CA-4 | Atividades com prazo ≤ 2 dias destacadas em vermelho |
| CA-5 | Durante o carregamento, exibe `DashboardSkeleton` animado |
| CA-6 | Dados buscados de `GET /api/dashboard` em única requisição |

| Tarefa | Responsável |
|--------|-------------|
| Criar `GET /dashboard` em `routes/dashboard.js` | Backend |
| Implementar `DashboardService.js` com agregações | Backend |
| Criar hook `useDashboard` em `hooks/index.ts` | Frontend |
| Implementar `Dashboard.tsx` com grid + BarChart + lista | Frontend |
| Implementar `DashboardSkeleton` | Frontend |

---

### KADU-21 — Listagem de Turmas com Métricas · `3 pts`

**Como** professor, **quero** ver minhas turmas em cards com qtd. de alunos e média, **para que** identifique quais turmas precisam de atenção.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | Cada card exibe: nome, disciplina, período, qtd. de alunos e média |
| CA-2 | Média colorida pelos limiares de `corNota()` |
| CA-3 | Clicar no card navega para detalhes da turma |
| CA-4 | Botão de lixeira abre `AlertDialog` de confirmação antes de excluir |
| CA-5 | Exclusão exibe toast de sucesso ou erro |
| CA-6 | Loading exibe `TurmasSkeleton` (4 card-placeholders) |

| Tarefa | Responsável |
|--------|-------------|
| `GET /turmas` retorna `qtdAlunos` e `media` (join com notas) | Backend |
| Implementar `TurmasSkeleton` | Frontend |
| Substituir `window.confirm()` por `AlertDialog` para exclusão | Frontend |
| Integrar `corNota()` de `grades.ts` | Frontend |

---

### KADU-22 — Listagem e Filtro de Alunos · `3 pts`

**Como** professor, **quero** buscar alunos por nome, e-mail ou matrícula e filtrá-los por turma, **para que** localize qualquer aluno rapidamente.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | Busca filtra por nome, e-mail e matrícula simultaneamente (case-insensitive) |
| CA-2 | Dropdown "Filtrar por turma" com opção padrão "Todas as Turmas" |
| CA-3 | Os dois filtros combinados (AND) |
| CA-4 | Estado vazio distingue "sem cadastros" de "sem resultados para filtros" |
| CA-5 | Botão "Ver Boletim" navega para `/alunos/:id/boletim` |
| CA-6 | Loading exibe `AlunosSkeleton` (6 card-placeholders) |
| CA-7 | Exclusão usa `AlertDialog` com nome do aluno em negrito |

| Tarefa | Responsável |
|--------|-------------|
| `GET /alunos` retorna `turmaId` para filtragem no frontend | Backend |
| Implementar filtro combinado em `Alunos.tsx` | Frontend |
| Implementar `AlunosSkeleton` | Frontend |
| Substituir `window.confirm()` por `AlertDialog` | Frontend |

---

### KADU-23 — Lançamento de Notas por Bimestre · `8 pts`

**Como** professor, **quero** lançar e editar notas por bimestre e ver a média em tempo real, **para que** registre o desempenho de forma precisa e imediata.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | Fluxo: seleciona turma → lista alunos → seleciona aluno → preenche nota |
| CA-2 | 4 botões de bimestre permitem alternar qual nota está sendo editada |
| CA-3 | Média recalculada a cada keystroke e exibida em tempo real |
| CA-4 | Status ("Aprovado", "Recuperação", "Reprovado") exibido com cor |
| CA-5 | Resumo de todos os bimestres visível durante o preenchimento |
| CA-6 | Input com `type="number" min="0" max="10" step="0.1"` |
| CA-7 | Ao salvar: toast de sucesso e retorno para lista de alunos da turma |
| CA-8 | Cabeçalho exibe `{nomeTurma} • {nomeAluno}` permanentemente |
| CA-9 | Skeleton durante carregamento dos dados |

| Tarefa | Responsável |
|--------|-------------|
| Corrigir bug: `POST /notas` passava `professorId` como `undefined` | Backend |
| `GET /notas/turma/:id/aluno/:id` retorna objeto com 4 bimestres (null se não lançado) | Backend |
| Criar `NotasListaTurmas.tsx` (ponto de entrada do fluxo) | Frontend |
| Criar `NotasListaAlunos.tsx` com busca e média atual | Frontend |
| Criar `NotasLancamento.tsx` com seletor, input e preview | Frontend |
| Implementar `NotasLancamentoSkeleton` | Frontend |

---

### KADU-24 — Boletim do Aluno com Impressão · `5 pts`

**Como** professor, **quero** visualizar o boletim completo de um aluno e imprimi-lo, **para que** entregue um documento formal de desempenho.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | Exibe: nome, matrícula, série e professor responsável |
| CA-2 | Tabela com colunas: 1º ao 4º Bimestre, Média e Status |
| CA-3 | Notas e médias coloridas pelos limiares de `corNota()` |
| CA-4 | Status exibido em `<Badge>` com variante de `varianteBadge()` |
| CA-5 | Linha de rodapé com Média Geral entre todas as disciplinas |
| CA-6 | Botão "Imprimir Boletim" aciona `window.print()` |
| CA-7 | CSS print oculta sidebar e botões, exibe apenas o conteúdo |
| CA-8 | Skeleton durante carregamento |

| Tarefa | Responsável |
|--------|-------------|
| `GET /notas/aluno/:id` retorna array com `materia`, `turmaNome` e 4 bimestres | Backend |
| Criar `Boletim.tsx` com tabela e cálculo de médias | Frontend |
| Implementar CSS print via `<style>` inline | Frontend |
| Implementar `BoletimSkeleton` | Frontend |

---

### KADU-25 — Refatoração: grades.ts (SRP + DIP do SOLID) · `2 pts`

**Como** desenvolvedor, **quero** centralizar a lógica de cor e status de notas em um único módulo, **para que** não haja divergência de limiares entre telas e qualquer mudança de regra seja feita em um só lugar.

> **Princípio SOLID aplicado:** Single Responsibility Principle (SRP) — a lógica de negócio de avaliação fica separada dos componentes de UI. Dependency Inversion Principle (DIP) — componentes dependem da abstração `grades.ts`, não de implementações locais.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | `src/lib/grades.ts` exporta: `corNota()`, `statusNota()` e `varianteBadge()` |
| CA-2 | Todos os arquivos que calculavam cor/status inline passam a importar de `grades.ts` |
| CA-3 | Nenhum limiar de nota (5, 7, 9) duplicado fora de `grades.ts` |
| CA-4 | Tipo `StatusNota` exportado para uso com TypeScript |

| Tarefa | Responsável |
|--------|-------------|
| Criar `frontend/src/lib/grades.ts` com as três funções | Frontend |
| Refatorar `Turmas.tsx`, `NotasLancamento.tsx`, `Boletim.tsx` e `NotasListaAlunos.tsx` | Frontend |
| Remover toda lógica de cor/status inline nos arquivos refatorados | Frontend |

---

### KADU-26 — Substituição de window.confirm por AlertDialog · `2 pts`

**Como** professor, **quero** ver um diálogo visual consistente ao excluir registros, **para que** a confirmação seja clara e coerente com o design system.

> **Padrão de UX aplicado:** Strategy de UX — o mesmo padrão de interação destrutiva é aplicado uniformemente, eliminando comportamento nativo do browser que quebrava a consistência visual.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | Nenhuma chamada a `window.confirm()` no código de produção |
| CA-2 | `AlertDialog` do Radix UI em todas as ações destrutivas |
| CA-3 | Diálogo exibe nome do item em negrito e "Esta ação não pode ser desfeita" |
| CA-4 | Botão de confirmação usa `variant="destructive"` (vermelho) |
| CA-5 | Botão "Cancelar" fecha sem ação |
| CA-6 | Botão de confirmação `disabled={deletando}` durante a requisição |

| Tarefa | Responsável |
|--------|-------------|
| Substituir `window.confirm()` em `Turmas.tsx` por `AlertDialog` | Frontend |
| Substituir `window.confirm()` em `Alunos.tsx` por `AlertDialog` | Frontend |
| Garantir `e.stopPropagation()` no handler do botão de lixeira | Frontend |

---

### KADU-27 — Skeleton Loading em Todas as Páginas · `3 pts`

**Como** professor, **quero** ver placeholders animados durante o carregamento, **para que** perceba que o sistema está trabalhando.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | As 6 páginas com fetch exibem skeleton durante `loading === true` |
| CA-2 | Skeleton respeita a estrutura visual real da página |
| CA-3 | Apenas `<Skeleton>` do shadcn/ui é usado (sem spinners ad-hoc) |
| CA-4 | Skeleton não aparece após os dados carregarem |

| Tarefa | Responsável |
|--------|-------------|
| `DashboardSkeleton` em `Dashboard.tsx` | Frontend |
| `TurmasSkeleton` em `Turmas.tsx` | Frontend |
| `AlunosSkeleton` em `Alunos.tsx` | Frontend |
| `NotasLancamentoSkeleton` em `NotasLancamento.tsx` | Frontend |
| `BoletimSkeleton` em `Boletim.tsx` | Frontend |
| `ListaAlunosSkeleton` em `NotasListaAlunos.tsx` | Frontend |

---

### KADU-28 — Busca de Alunos em NotasListaAlunos · `2 pts`

**Como** professor, **quero** buscar alunos por nome ou matrícula na listagem da turma, **para que** localize rapidamente o aluno antes de lançar a nota.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | Campo de busca no cabeçalho do card "Alunos da Turma" |
| CA-2 | Filtra por nome (case-insensitive) e matrícula em tempo real |
| CA-3 | Estado vazio exibe "Nenhum aluno encontrado para essa busca." |
| CA-4 | Busca não interfere nos cards de métricas |

| Tarefa | Responsável |
|--------|-------------|
| Adicionar estado `busca` em `NotasListaAlunos.tsx` | Frontend |
| Calcular `filtrados` com `.filter()` por nome e matrícula | Frontend |
| Renderizar `filtrados` no lugar de `turma.alunos` | Frontend |

---

### KADU-29 — Bug Fix: professorId undefined em POST /notas · `1 pt`

**Como** desenvolvedor, **quero** corrigir o bug em que o `professorId` era passado como `undefined`, **para que** o salvamento de notas funcione para qualquer professor autenticado.

| # | Critério de Aceite |
|---|--------------------|
| CA-1 | `TurmaRepository.findById(turmaId, professorId)` recebe o ID real do professor |
| CA-2 | `req.user.id` extraído do JWT pelo middleware `auth` e utilizado na rota |
| CA-3 | `POST /notas` persiste a nota com a disciplina correta (`turma.disciplina`) |

| Tarefa | Responsável |
|--------|-------------|
| Alterar `routes/notas.js:24`: usar `req.user.id` como segundo argumento | Backend |
| Verificar que `middleware/auth.js` popula `req.user.id` corretamente | Backend |

---

## Resumo da Sprint 2

| ID | História | Pontos | Tipo |
|----|----------|--------|------|
| KADU-20 | Dashboard com métricas e gráfico | 5 | Feature |
| KADU-21 | Listagem de turmas com cards e métricas | 3 | Feature |
| KADU-22 | Listagem e filtro de alunos | 3 | Feature |
| KADU-23 | Lançamento de notas por bimestre | 8 | Feature |
| KADU-24 | Boletim do aluno com impressão | 5 | Feature |
| KADU-25 | Refatoração: grades.ts (SRP/DIP) | 2 | Tech Debt |
| KADU-26 | Substituição de window.confirm por AlertDialog | 2 | UX Debt |
| KADU-27 | Skeleton loading em todas as páginas | 3 | UX Quality |
| KADU-28 | Busca de alunos em NotasListaAlunos | 2 | Enhancement |
| KADU-29 | Bug fix: professorId undefined | 1 | Bug Fix |
| **Total** | | **34 pts** | |

---

## Definição de Pronto (DoD) — Sprint 2

- [ ] Nenhum `window.confirm()` ou `window.alert()` no código de produção
- [ ] Todos os estados de loading cobertos por skeleton
- [ ] Mensagens de erro seguem o padrão `AlertCircle + bg-red-50`
- [ ] Lógica de cor/status de nota importada exclusivamente de `grades.ts`
- [ ] Bug do `professorId` corrigido e testado manualmente
- [ ] Build do frontend (`vite build`) sem erros de TypeScript
- [ ] Funcionalidade testada com usuário demo (`professor@escola.edu.br`)
