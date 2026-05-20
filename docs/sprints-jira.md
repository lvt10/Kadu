# Estrutura de Sprints — Jira · Projeto Kadu

## Convenções

| Prefixo | Tipo |
|---------|------|
| RN | Regra de Negócio |
| RNF | Requisito Não-Funcional |

Escala de pontos: Fibonacci (1, 2, 3, 5, 8, 13)

---

## Sprint 1 — "Autenticação e Cadastros Base" (Concluída)

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-20 | RN: O e-mail deve ser único (não pode haver dois professores com o mesmo e-mail) | RF: TELA DE LOGIN | — |
| SCRUM-21 | RN: A senha deve conter no mínimo 8 caracteres, incluindo letras e números | RF: TELA DE LOGIN | — |
| SCRUM-33 | RN: A tela de login deve requisitar email e senha de login | RF: TELA DE LOGIN | — |
| SCRUM-25 | RN04: O campo "Nome Completo" e "matricula" são obrigatórios | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | — |
| SCRUM-27 | RN06: Um aluno só pode ser visualizado pelo professor que o cadastrou (Filtro por Tenant_ID) | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | — |
| SCRUM-28 | RNF03 (Usabilidade): O formulário de cadastro deve permitir o uso da tecla "Tab" para navegar entre campos | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | — |
| SCRUM-30 | RN08: Uma turma deve estar vinculada a um Ano Letivo (ex: 2024) | TELA DE GERENCIAMENTO DE TURMAS | — |
| SCRUM-31 | RN09: O professor deve poder "Enturmar" um aluno (vincular o Aluno X à Turma Y) | TELA DE GERENCIAMENTO DE TURMAS | — |
| SCRUM-32 | RNF07 (Disponibilidade): O módulo de turmas deve estar disponível 99,9% do tempo | TELA DE GERENCIAMENTO DE TURMAS | — |

---

## Sprint 2 — "Gestão Pedagógica & Qualidade de UX"

**Objetivo:** Entregar as funcionalidades de notas, boletim e dashboard com qualidade de UX.
**Velocidade planejada:** 28 pontos

---

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-34 | RN10: O professor deve visualizar dashboard com total de alunos, atividades ativas, taxa de presença do dia, média geral e gráfico de distribuição de notas | TELA DE DASHBOARD | 5 |
| SCRUM-35 | RN11: O professor deve visualizar suas turmas em cards com quantidade de alunos e média geral; deve poder excluir uma turma mediante confirmação explícita | TELA DE GERENCIAMENTO DE TURMAS | 3 |
| SCRUM-36 | RN12: O professor deve poder buscar alunos por nome, e-mail ou matrícula e filtrar por turma simultaneamente | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | 3 |
| SCRUM-37 | RN13: O professor deve poder lançar e editar notas de 1º a 4º bimestre por aluno; a média deve ser calculada automaticamente em tempo real | TELA DE LANÇAMENTO DE NOTAS | 8 |
| SCRUM-38 | RN14: O professor deve poder visualizar e imprimir o boletim completo de um aluno com notas por bimestre, média por disciplina e média geral | TELA DO BOLETIM | 5 |
| SCRUM-39 | RN15: Um aluno com média ≥ 6 deve ser classificado como "Aprovado"; com média < 6, como "Reprovado" | TELA DE LANÇAMENTO DE NOTAS | 1 |
| SCRUM-40 | RNF08 (Usabilidade): Todas as telas com carregamento de dados devem exibir skeleton animado; todas as ações destrutivas devem exibir diálogo de confirmação visual consistente | QUALIDADE DE UX | 3 |

**Total: 28 pontos**

---

### Critérios de Aceite por Item

**SCRUM-34 — Dashboard**
- [ ] Exibe: total de alunos, atividades ativas, presença do dia e média geral
- [ ] Gráfico de barras com distribuição de notas por faixa
- [ ] Lista de próximas atividades; prazo ≤ 2 dias destacado em vermelho
- [ ] Skeleton animado durante carregamento

**SCRUM-35 — Listagem de Turmas**
- [ ] Card por turma com: nome, disciplina, período, qtd. alunos e média
- [ ] Média colorida: verde ≥ 9 · azul ≥ 6 · vermelho < 6
- [ ] Exclusão exige confirmação com nome da turma e aviso "Esta ação não pode ser desfeita"
- [ ] Skeleton animado durante carregamento

**SCRUM-36 — Listagem de Alunos**
- [ ] Busca simultânea por nome, e-mail e matrícula (case-insensitive)
- [ ] Filtro por turma combinável com a busca
- [ ] Estado vazio diferencia "sem cadastros" de "sem resultados para os filtros"
- [ ] Exclusão exige confirmação com nome do aluno
- [ ] Skeleton animado durante carregamento

**SCRUM-37 — Lançamento de Notas**
- [ ] Fluxo: seleciona turma → lista alunos → seleciona aluno → lança nota do bimestre
- [ ] 4 botões de bimestre permitem alternar qual nota está sendo editada
- [ ] Média recalculada a cada keystroke; status "Aprovado"/"Reprovado" exibido em tempo real
- [ ] Nome da turma e do aluno visíveis permanentemente durante o preenchimento
- [ ] Campo aceita apenas valores entre 0 e 10 com passo de 0,1
- [ ] Campo de busca por nome/matrícula na listagem de alunos da turma
- [ ] Skeleton animado durante carregamento

**SCRUM-38 — Boletim**
- [ ] Exibe: nome, matrícula, série e professor responsável do aluno
- [ ] Tabela com colunas: 1º ao 4º Bimestre, Média e Status por disciplina
- [ ] Linha de rodapé com Média Geral entre todas as disciplinas
- [ ] Botão "Imprimir" oculta sidebar e navegação, exibindo apenas conteúdo pedagógico
- [ ] Skeleton animado durante carregamento

**SCRUM-39 — Regra de aprovação**
- [ ] Média ≥ 6 → "Aprovado" (badge azul)
- [ ] Média < 6 → "Reprovado" (badge vermelho)
- [ ] Regra aplicada de forma idêntica em todas as telas (lançamento, boletim, detalhes da turma)

**SCRUM-40 — Qualidade de UX**
- [ ] Skeleton em todas as 6 telas com fetch assíncrono
- [ ] Diálogo de confirmação visual (não `window.confirm` nativo) em todas as exclusões
- [ ] Sistema de cores e status de notas consistente entre todas as telas

---

## Definição de Pronto (DoD) — Sprint 2

- [ ] Todos os critérios de aceite verificados manualmente com o usuário demo
- [ ] Regra de aprovação (média ≥ 6) consistente em todas as telas
- [ ] Nenhum `window.confirm()` no código de produção
- [ ] Skeleton presente em todas as telas com carregamento assíncrono
- [ ] Build (`vite build`) sem erros de TypeScript
