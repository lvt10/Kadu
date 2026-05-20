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

**Objetivo:** Entregar as funcionalidades de notas, boletim e dashboard com qualidade de UX e refatorações baseadas em SOLID.

---

### TELA DE DASHBOARD

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-34 | RN10: O professor deve visualizar o total de alunos, atividades ativas, taxa de presença do dia e média geral ao acessar o dashboard | TELA DE DASHBOARD | 5 |
| SCRUM-35 | RN11: O dashboard deve exibir um gráfico de distribuição de notas por faixa de desempenho | TELA DE DASHBOARD | 3 |
| SCRUM-36 | RN12: O dashboard deve listar as próximas atividades com prazo, destacando em vermelho as com ≤ 2 dias restantes | TELA DE DASHBOARD | 2 |
| SCRUM-37 | RNF08 (Usabilidade): O dashboard deve exibir skeleton animado durante o carregamento dos dados | TELA DE DASHBOARD | 1 |

---

### TELA DE GERENCIAMENTO DE TURMAS

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-38 | RN13: Cada turma deve exibir a quantidade de alunos matriculados e a média geral de notas da turma | TELA DE GERENCIAMENTO DE TURMAS | 3 |
| SCRUM-39 | RN14: A exclusão de uma turma deve exigir confirmação explícita do professor antes de ser executada | TELA DE GERENCIAMENTO DE TURMAS | 2 |
| SCRUM-40 | RNF09 (Usabilidade): O sistema deve exibir skeleton animado durante o carregamento da listagem de turmas | TELA DE GERENCIAMENTO DE TURMAS | 1 |

---

### TELA DE GERENCIAMENTO DE ALUNOS

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-41 | RN15: O professor deve poder buscar alunos por nome, e-mail ou matrícula e filtrar por turma simultaneamente | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | 3 |
| SCRUM-42 | RN16: A exclusão de um aluno deve exigir confirmação explícita com o nome do aluno destacado antes de ser executada | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | 2 |
| SCRUM-43 | RNF10 (Usabilidade): O sistema deve exibir skeleton animado durante o carregamento da listagem de alunos | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | 1 |

---

### TELA DE LANÇAMENTO DE NOTAS

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-44 | RN17: O professor deve poder lançar e editar notas de 1º a 4º bimestre individualmente para cada aluno de cada turma | TELA DE LANÇAMENTO DE NOTAS | 8 |
| SCRUM-45 | RN18: A média do aluno deve ser calculada automaticamente em tempo real conforme as notas dos bimestres são inseridas | TELA DE LANÇAMENTO DE NOTAS | 3 |
| SCRUM-46 | RN19: Um aluno com média ≥ 6 deve ser classificado como "Aprovado"; com média < 6, como "Reprovado" | TELA DE LANÇAMENTO DE NOTAS | 1 |
| SCRUM-47 | RN20: O sistema deve exibir o nome da turma e do aluno permanentemente visíveis durante o lançamento de notas | TELA DE LANÇAMENTO DE NOTAS | 1 |
| SCRUM-48 | RNF11 (Usabilidade): O campo de nota deve aceitar apenas valores numéricos entre 0 e 10 com precisão de 0,1 | TELA DE LANÇAMENTO DE NOTAS | 1 |
| SCRUM-49 | RNF12 (Usabilidade): O professor deve poder buscar um aluno por nome ou matrícula na listagem de alunos da turma antes de lançar nota | TELA DE LANÇAMENTO DE NOTAS | 2 |
| SCRUM-50 | RNF13 (Usabilidade): O sistema deve exibir skeleton animado durante o carregamento dos dados de turma, aluno e notas existentes | TELA DE LANÇAMENTO DE NOTAS | 1 |

---

### TELA DO BOLETIM

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-51 | RN21: O boletim deve exibir nome, matrícula, série, professor responsável e notas de todos os bimestres por disciplina | TELA DO BOLETIM | 3 |
| SCRUM-52 | RN22: O boletim deve calcular e exibir a Média Geral entre todas as disciplinas do aluno | TELA DO BOLETIM | 2 |
| SCRUM-53 | RN23: O professor deve poder imprimir o boletim; durante a impressão, apenas o conteúdo pedagógico deve ser visível (sem sidebar ou botões de navegação) | TELA DO BOLETIM | 2 |
| SCRUM-54 | RNF14 (Usabilidade): O boletim deve exibir skeleton animado durante o carregamento dos dados | TELA DO BOLETIM | 1 |

---

### QUALIDADE INTERNA (Refatoração & Bug Fix)

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-55 | RNF15 (Manutenibilidade): A lógica de cor e status de notas deve ser centralizada em um único módulo (`grades.ts`), eliminando duplicação entre telas — SRP e DIP do SOLID | REFATORAÇÃO | 2 |
| SCRUM-56 | RNF16 (Usabilidade): Todas as ações destrutivas devem usar o componente `AlertDialog` do design system em vez de `window.confirm()` nativo do browser | REFATORAÇÃO | 2 |
| SCRUM-57 | BUG: O endpoint `POST /notas` retornava erro 500 ao salvar notas pois `professorId` era passado como `undefined` para o repositório | BUG FIX | 1 |

---

## Resumo da Sprint 2

| Tag | Qtd. de itens | Total de pontos |
|-----|--------------|-----------------|
| TELA DE DASHBOARD | 4 | 11 |
| TELA DE GERENCIAMENTO DE TURMAS | 3 | 6 |
| TELA DE GERENCIAMENTO DE ALUNOS | 3 | 6 |
| TELA DE LANÇAMENTO DE NOTAS | 7 | 17 |
| TELA DO BOLETIM | 4 | 8 |
| REFATORAÇÃO / BUG FIX | 3 | 5 |
| **Total** | **24 itens** | **53 pts** |

---

## Definição de Pronto (DoD) — Sprint 2

- [ ] Regras de negócio validadas manualmente com o usuário demo (`professor@escola.edu.br`)
- [ ] Nenhum `window.confirm()` no código de produção
- [ ] Todos os estados de loading cobertos por skeleton
- [ ] Lógica de cor/status importada exclusivamente de `grades.ts`
- [ ] Bug SCRUM-57 verificado via Postman/Insomnia
- [ ] Build (`vite build`) sem erros de TypeScript
