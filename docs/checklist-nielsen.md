# Checklist das 10 Heurísticas de Nielsen — Projeto Kadu

## Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Implementado |
| ⚠️ | Implementado parcialmente |
| ❌ | Não implementado |

---

## H1 — Visibilidade do Status do Sistema ✅

> O sistema deve manter o usuário informado sobre o que está acontecendo, com feedback em tempo razoável.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Botão muda texto durante submit | `Login.tsx:118` | `carregando ? 'Entrando...' : 'Entrar'` |
| Botão muda texto durante submit | `NotasLancamento.tsx:248` | `carregando ? 'Salvando...' : 'Salvar Notas'` |
| Botão muda texto durante submit | `Registro.tsx:174` | `carregando ? 'Enviando código...' : 'Enviar Código de Verificação'` |
| Botão muda texto durante exclusão | `Turmas.tsx:187` | `deletando ? 'Excluindo...' : 'Excluir'` |
| Skeleton loading animado | `Dashboard.tsx` | `DashboardSkeleton` substituindo layout durante `loading === true` |
| Skeleton loading animado | `Turmas.tsx` | `TurmasSkeleton` com 4 cards-fantasma |
| Skeleton loading animado | `Alunos.tsx` | `AlunosSkeleton` com 6 cards-fantasma |
| Skeleton loading animado | `NotasLancamento.tsx` | `NotasLancamentoSkeleton` |
| Skeleton loading animado | `Boletim.tsx` | `BoletimSkeleton` |
| Skeleton loading animado | `NotasListaAlunos.tsx` | `ListaAlunosSkeleton` |
| Toast de sucesso | `Turmas.tsx:86` | `toast.success('Turma excluída com sucesso!')` via Sonner |
| Toast de erro | `NotasLancamento.tsx:99` | `toast.error(e instanceof Error ? e.message : 'Erro ao salvar notas')` |
| Média calculada em tempo real | `NotasLancamento.tsx` | `calcularMedia()` recalcula a cada keystroke |

---

## H2 — Correspondência com o Mundo Real ✅

> O sistema deve usar a linguagem do usuário — palavras e conceitos familiares ao público-alvo.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Interface em português | `Root.tsx:8–12` | Sidebar com "Turmas", "Alunos", "Notas" |
| Terminologia escolar brasileira | `Boletim.tsx:101` | "Boletim Escolar", colunas "1º Bimestre"…"4º Bimestre" |
| Terminologia escolar brasileira | `NotasLancamento.tsx:189` | Botões "{n}º Bimestre" |
| Status pedagógico contextualizado | `grades.ts:9–16` | `statusNota()` retorna "Aprovado", "Recuperação", "Reprovado" |
| Color coding de notas | `grades.ts:1–7` | Verde ≥ 9 · Azul ≥ 7 · Amarelo ≥ 5 · Vermelho < 5 |
| Placeholder contextual | `Login.tsx:94` | `placeholder="professor@escola.edu.br"` |
| Campo "Matrícula" explícito | `Alunos.tsx:164` | "Matrícula: {aluno.matricula}" junto ao nome |

---

## H3 — Controle e Liberdade do Usuário ✅

> Usuários frequentemente escolhem funções por engano; é preciso fornecer saídas de emergência claras.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Botão "Voltar" em página de detalhe | `NotasLancamento.tsx:131–133` | ArrowLeft navega de volta à lista da turma |
| Botão "Voltar" em página de detalhe | `Boletim.tsx:88–90` | "Voltar para Alunos" |
| Botão "Cancelar" em formulário | `NotasLancamento.tsx:246` | Descarta alterações sem salvar |
| Cancelar modal de reset de senha | `Login.tsx:196–198` | Botão "Cancelar" dentro do modal |
| Voltar na verificação de código | `Registro.tsx:247–249` | "Voltar e alterar dados" retorna à etapa 1 |
| Confirmação antes de excluir turma | `Turmas.tsx:170–191` | `AlertDialog` com "Esta ação não pode ser desfeita" |
| Confirmação antes de excluir aluno | `Alunos.tsx:209–230` | Mesmo padrão de `AlertDialog` |

---

## H4 — Consistência e Padrões ✅

> Usuários não devem se perguntar se palavras ou ações diferentes significam a mesma coisa.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Fonte única para cor de nota | `grades.ts:1–7` | `corNota()` consumida por `Turmas.tsx`, `NotasLancamento.tsx`, `Boletim.tsx`, `NotasListaAlunos.tsx` — elimina divergência que havia entre 3 arquivos |
| Fonte única para status | `grades.ts:11–16` | `statusNota()` define Aprovado ≥ 7 / Recuperação ≥ 5 / Reprovado em um único lugar |
| Variante de badge padronizada | `grades.ts:18–22` | `varianteBadge()` mapeia status → variante do `Badge` de forma uniforme |
| AlertDialog em vez de `window.confirm` | `Turmas.tsx`, `Alunos.tsx` | Ambas as páginas usam o mesmo componente Radix UI com visual idêntico |
| Sistema de cards consistente | Dashboard, Turmas, Alunos | Todos usam `<Card><CardHeader><CardTitle>` com a mesma hierarquia visual |
| Hierarquia de botões | Todas as páginas | Primário: `<Button>` filled · Secundário: `variant="outline"` ou `variant="ghost"` |

---

## H5 — Prevenção de Erros ✅

> Melhor que uma boa mensagem de erro é um design que evita o problema.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Validação de senha em tempo real (4 critérios) | `Registro.tsx:24–30` | Verifica: ≥ 8 chars · ≥ 1 letra · ≥ 1 número · ≥ 1 especial — cada critério exibe `✓`/`○` |
| Confirmação de senha inline | `Registro.tsx:167–170` | "✓ Senhas coincidem" ou "✗ Senhas não coincidem" antes do submit |
| Verificação de email em 2 etapas | `Registro.tsx:13` | `etapa: 'formulario' | 'codigo'` — impede conta com email inválido |
| Restrição de range no input de nota | `NotasLancamento.tsx:203` | `type="number" min="0" max="10" step="0.1"` |
| Botão de confirmação desabilitado durante operação | `Turmas.tsx:183–186` | `disabled={deletando}` previne double-submit |
| Botão submit desabilitado durante loading | `Login.tsx:117` | `disabled={carregando}` |
| Input de código aceita apenas dígitos | `Registro.tsx:217` | `.replace(/\D/g, '').slice(0, 6)` sanitiza em tempo real |

---

## H6 — Reconhecimento em vez de Memorização ✅

> Minimize a carga de memória tornando objetos, ações e opções visíveis.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Ícones + rótulos na sidebar | `Root.tsx:43–55` | Cada item tem ícone e `<span>` com nome |
| Placeholder em todos os inputs | `Login.tsx:94,102` | `"professor@escola.edu.br"` e `"••••••••"` |
| Contexto turma + aluno no cabeçalho | `NotasLancamento.tsx:136–137` | `{turma.nome} • {aluno.nome}` permanece visível durante o preenchimento |
| Cards de contexto no lançamento | `NotasLancamento.tsx:141–177` | Cards "Aluno", "Turma" e "Média Calculada" sempre visíveis |
| Resumo de todos os bimestres | `NotasLancamento.tsx:226–241` | Notas dos outros bimestres ficam visíveis durante edição |
| Estado ativo destacado na sidebar | `Root.tsx:48–51` | `bg-blue-50 text-blue-700` indica seção atual |

---

## H7 — Flexibilidade e Eficiência de Uso ⚠️

> Aceleradores podem acelerar a interação para o usuário experiente.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Busca por nome, e-mail ou matrícula | `Alunos.tsx:101–106` | Filtro unificado cobre três campos simultaneamente |
| Filtro por turma com Select | `Alunos.tsx:139–145` | Dropdown reduz o conjunto de resultados |
| Busca por nome/matrícula em NotasListaAlunos | `NotasListaAlunos.tsx:64–67` | Campo de busca inline na listagem da turma |
| Estado vazio informativo | `Alunos.tsx:200–206` | Distingue "sem cadastros" de "sem resultados para filtros" |
| ⚠️ Sem atalhos de teclado | — | Não há atalhos globais (ex.: Ctrl+N, Ctrl+S) |
| ⚠️ Sem paginação/ordenação | — | Listas crescem linearmente sem controle de volume |

---

## H8 — Design Estético e Minimalista ✅

> Diálogos não devem conter informação irrelevante ou raramente necessária.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Layout baseado em cards | Todas as páginas | Nenhum elemento puramente decorativo |
| Hierarquia tipográfica clara | `Turmas.tsx:108–109` | `text-3xl font-bold` título > `text-gray-500 text-sm` subtítulo |
| Sidebar enxuta com 3 itens | `Root.tsx:8–12` | Apenas Turmas, Alunos e Notas |
| Color coding semântico | `grades.ts:1–7` | Cores carregam significado pedagógico, não são decorativas |
| Boletim otimizado para impressão | `Boletim.tsx:87` | Elementos de navegação ocultos via `print:hidden` |

---

## H9 — Ajuda a Reconhecer, Diagnosticar e Recuperar de Erros ✅

> Mensagens de erro devem ser claras, indicar o problema e sugerir solução.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Mensagem de erro com ícone e fundo colorido | `Login.tsx:85–88` | `<AlertCircle>` + `bg-red-50 border-red-200` |
| Mensagem de erro com ícone e fundo colorido | `Registro.tsx:116–119` | Mesmo padrão no cadastro |
| Botão "Tentar novamente" | `Turmas.tsx:100` | `onClick={() => window.location.reload()}` |
| Botão "Tentar novamente" | `Alunos.tsx:114–116` | Idem na página de alunos |
| Erro contextualizado | `Alunos.tsx:113` | "Erro ao carregar alunos. Tente novamente." |
| Toast de erro com detalhe | `NotasLancamento.tsx:99` | Propaga mensagem do servidor quando disponível |

---

## H10 — Ajuda e Documentação ⚠️

> Quando necessário, ajuda deve ser fácil de encontrar, focada na tarefa do usuário.

| Evidência | Arquivo | Detalhe |
|-----------|---------|---------|
| Credenciais de demonstração visíveis | `Login.tsx:131–139` | Card azul com e-mail e senha de demo |
| Placeholder explicativo em inputs | `Registro.tsx:126,135,144,163` | "Prof. Maria Silva", "Mínimo 8 caracteres", etc. |
| Mensagem de expiração do código | `Registro.tsx:222` | "O código expira em 10 minutos" |
| Instrução de próximo passo | `NotasListaAlunos.tsx:75` | "Selecione um aluno para lançar as notas" |
| Estado vazio com orientação | `Turmas.tsx:165` | "Clique em 'Adicionar Turma' para começar." |
| ⚠️ Sem tooltips elaborados em ações destrutivas | — | Botão de lixeira tem `title` mas sem tooltip descritivo |
| ⚠️ Sem documentação inline ou FAQ | — | Não existe seção de ajuda contextual |

---

## Resumo Executivo

| Heurística | Status | Resumo |
|------------|--------|--------|
| H1 — Visibilidade do status | ✅ | Skeleton + loading states + toasts |
| H2 — Mundo real | ✅ | Português + terminologia escolar brasileira |
| H3 — Controle e liberdade | ✅ | Voltar, Cancelar, AlertDialog em deleções |
| H4 — Consistência | ✅ | `grades.ts` como fonte única + AlertDialog uniforme |
| H5 — Prevenção de erros | ✅ | Validação em tempo real, 2 etapas, min/max nos inputs |
| H6 — Reconhecimento | ✅ | Ícones + labels, placeholders, contexto no header |
| H7 — Flexibilidade | ⚠️ | Busca + filtro; sem atalhos de teclado |
| H8 — Estética minimalista | ✅ | Cards sem ornamentos; color coding semântico |
| H9 — Recuperação de erros | ✅ | AlertCircle + fundo vermelho + "Tentar novamente" |
| H10 — Documentação | ⚠️ | Credenciais de demo e placeholders; sem ajuda contextual |

**Resultado: 8/10 heurísticas totalmente atendidas · 2/10 parcialmente atendidas · 0/10 não atendidas**

---

## Complemento: Lei de Fitts, Lei de Hick e Consistência

### Lei de Fitts
> Tempo de aquisição de um alvo é função do seu tamanho e da distância até ele.

- Botões primários com `w-full` em mobile maximizam a área clicável (`Login.tsx:117`, `Registro.tsx:174`)
- Botão "Salvar Notas" posicionado no canto inferior direito (`justify-end mt-6`), reduzindo deslocamento após o preenchimento
- Ícone de lixeira usa `size="icon"` (40×40 px), área mínima recomendada para touch
- Cards de Turmas e Alunos têm área clicável grande (o card inteiro navega para detalhe)

### Lei de Hick-Hyman
> Tempo de decisão aumenta logaritmicamente com o número de alternativas.

- Sidebar com apenas **3 destinos** (Turmas, Alunos, Notas) mantém o tempo de escolha mínimo
- Seleção de bimestre apresenta **4 opções** em grade fixa — quantidade previsível sem sobrecarga
- Filtro de turmas usa `<Select>` com opções discretas em vez de campo livre
- Busca + filtro combinados em Alunos reduz progressivamente o conjunto de decisão

### Princípio de Consistência

**Interna:**
- `grades.ts` é o ponto único de definição de limiares de nota — qualquer mudança pedagógica propaga automaticamente para todas as telas
- Padrão de erro visual (`AlertCircle` + `bg-red-50 border-red-200`) idêntico em Login, Registro e modal de reset
- Todos os estados de loading usam `<Skeleton>` do shadcn/ui, nunca spinners ad-hoc

**Externa (padrões web):**
- `AlertDialog` do Radix UI substitui `window.confirm()`, mantendo consistência com o design system
- Iconografia via `lucide-react` padroniza o vocabulário visual (ArrowLeft = voltar, Trash2 = excluir, Search = buscar)
