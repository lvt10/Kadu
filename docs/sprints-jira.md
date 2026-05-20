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

## Sprint 2 — "Construção do Aplicativo" (Concluída)

**Objetivo:** Construir todas as funcionalidades pedagógicas do sistema — dashboard, lançamento de notas e boletim.
**Velocidade:** 32 pontos

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-34 | RN10: O professor deve visualizar um dashboard com total de alunos, atividades ativas, taxa de presença do dia e média geral de notas | TELA DE DASHBOARD | 5 |
| SCRUM-35 | RN11: O dashboard deve exibir um gráfico de distribuição de notas e a lista de próximas atividades com prazo destacado em vermelho quando ≤ 2 dias | TELA DE DASHBOARD | 3 |
| SCRUM-36 | RN12: O professor deve visualizar suas turmas em cards com quantidade de alunos e média geral; deve poder excluir uma turma | TELA DE GERENCIAMENTO DE TURMAS | 3 |
| SCRUM-37 | RN13: O professor deve poder visualizar os detalhes de uma turma com a tabela de notas por bimestre de todos os alunos | TELA DE GERENCIAMENTO DE TURMAS | 3 |
| SCRUM-38 | RN14: O professor deve poder buscar alunos por nome, e-mail ou matrícula e filtrar por turma | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | 3 |
| SCRUM-39 | RN15: O professor deve poder lançar e editar notas de 1º a 4º bimestre individualmente para cada aluno de cada turma | TELA DE LANÇAMENTO DE NOTAS | 8 |
| SCRUM-40 | RN16: A média do aluno deve ser calculada automaticamente em tempo real conforme as notas dos bimestres são inseridas | TELA DE LANÇAMENTO DE NOTAS | 3 |
| SCRUM-41 | RN17: Um aluno com média ≥ 6 deve ser classificado como "Aprovado"; com média < 6, como "Reprovado" | TELA DE LANÇAMENTO DE NOTAS | 1 |
| SCRUM-42 | RN18: O professor deve poder visualizar e imprimir o boletim completo de um aluno com notas por bimestre, média por disciplina e média geral | TELA DO BOLETIM | 3 |

**Total Sprint 2: 32 pontos**

---

### Critérios de Aceite — Sprint 2

**SCRUM-34 e 35 — Dashboard**
- [ ] Exibe total de alunos, atividades ativas, presença do dia e média geral em cards
- [ ] Gráfico de barras com distribuição de notas por faixa
- [ ] Lista de próximas atividades com nome da turma e contador de dias; prazo ≤ 2 dias em vermelho
- [ ] Dados exclusivos do professor autenticado

**SCRUM-36 e 37 — Turmas**
- [ ] Card por turma exibe: nome, disciplina, período, qtd. alunos e média
- [ ] Detalhe da turma exibe tabela com notas dos 4 bimestres de todos os alunos
- [ ] Exclusão de turma disponível

**SCRUM-38 — Alunos**
- [ ] Busca simultânea por nome, e-mail e matrícula (case-insensitive)
- [ ] Filtro por turma combinável com a busca
- [ ] Estado vazio distingue "sem cadastros" de "sem resultados para os filtros"

**SCRUM-39 e 40 — Lançamento de Notas**
- [ ] Fluxo: seleciona turma → lista alunos → seleciona aluno → lança nota do bimestre
- [ ] 4 botões de bimestre permitem alternar qual nota está sendo editada
- [ ] Resumo de todos os bimestres visível durante o preenchimento
- [ ] Nome da turma e do aluno visíveis permanentemente
- [ ] Campo aceita apenas valores entre 0 e 10 com passo de 0,1

**SCRUM-41 — Regra de aprovação**
- [ ] Média ≥ 6 → "Aprovado"
- [ ] Média < 6 → "Reprovado"

**SCRUM-42 — Boletim**
- [ ] Exibe: nome, matrícula, série e professor responsável
- [ ] Tabela com 1º ao 4º Bimestre, Média e Status por disciplina
- [ ] Linha de rodapé com Média Geral entre todas as disciplinas
- [ ] Botão "Imprimir" oculta sidebar e navegação, exibindo apenas conteúdo pedagógico

---

## Sprint 3 — "Refatoração e Qualidade de UX" (Concluída)

**Objetivo:** Elevar a qualidade do sistema aplicando as 10 Heurísticas de Nielsen, princípios SOLID e consistência visual em todas as telas.
**Velocidade:** 21 pontos

| ID | Descrição | Tag | Pts |
|----|-----------|-----|-----|
| SCRUM-43 | RNF08 (Manutenibilidade — SOLID SRP/DIP): A lógica de cor e status de notas deve ser centralizada em um único módulo reutilizável, eliminando duplicação entre telas | REFATORAÇÃO / SOLID | 3 |
| SCRUM-44 | RNF09 (Usabilidade — Nielsen H4): Todas as ações destrutivas devem usar diálogo de confirmação visual consistente com o design system, substituindo o `window.confirm()` nativo | REFATORAÇÃO / UX | 2 |
| SCRUM-45 | RNF10 (Usabilidade — Nielsen H1): Todas as telas com carregamento de dados devem exibir skeleton animado no lugar do conteúdo enquanto aguardam a resposta do servidor | REFATORAÇÃO / UX | 3 |
| SCRUM-46 | RNF11 (Usabilidade — Nielsen H4 + Hick): O professor deve poder buscar um aluno por nome ou matrícula diretamente na listagem de alunos da turma antes de lançar nota | REFATORAÇÃO / UX | 2 |
| SCRUM-47 | RNF12 (Usabilidade — Nielsen H4): A classificação "Aprovado"/"Reprovado" com média ≥ 6 deve ser aplicada de forma idêntica em todas as telas do sistema | REFATORAÇÃO / UX | 1 |
| SCRUM-48 | RNF13 (Usabilidade — Nielsen H1): O sistema deve exibir feedback visual no botão de ação durante operações assíncronas (ex: "Salvando...", "Excluindo...") | REFATORAÇÃO / UX | 1 |
| SCRUM-49 | RNF14 (Usabilidade — Nielsen H9): Mensagens de erro devem ser exibidas com ícone, fundo colorido e opção de tentar novamente em todas as telas | REFATORAÇÃO / UX | 2 |
| SCRUM-50 | RNF15 (Usabilidade — Fitts): Botões de ação primária devem ocupar largura total em mobile; botões de exclusão devem ter área mínima de toque de 40×40px | REFATORAÇÃO / UX | 1 |
| SCRUM-51 | BUG: O endpoint de salvar notas retornava erro 500 pois o identificador do professor não era enviado corretamente ao consultar os dados da turma | BUG FIX | 1 |
| SCRUM-52 | RNF16 (Usabilidade — Nielsen H3): O professor deve poder cancelar o lançamento de notas a qualquer momento e retornar à lista de alunos sem perder dados de outras telas | REFATORAÇÃO / UX | 2 |
| SCRUM-53 | RNF17 (Usabilidade — Nielsen H6): O nome da turma e do aluno devem permanecer visíveis no cabeçalho durante todo o preenchimento de notas | REFATORAÇÃO / UX | 1 |
| SCRUM-54 | RNF18 (Segurança): O envio de e-mail transacional deve ter tratamento de erro adequado para que uma falha no serviço de e-mail não derrube o servidor | REFATORAÇÃO / BACKEND | 2 |

**Total Sprint 3: 21 pontos**

---

### Critérios de Aceite — Sprint 3

**SCRUM-43 — Centralização de lógica (SOLID)**
- [ ] Um único módulo define os limiares de cor e status de notas
- [ ] Todas as telas consomem esse módulo; nenhum limiar duplicado no código
- [ ] Alteração no limiar reflete automaticamente em todas as telas

**SCRUM-44 — Diálogo de confirmação (Nielsen H4)**
- [ ] Nenhuma chamada a `window.confirm()` no código de produção
- [ ] Diálogo exibe o nome do item a ser excluído e "Esta ação não pode ser desfeita"
- [ ] Botão de confirmação em vermelho; botão "Cancelar" fecha sem ação
- [ ] Botão de confirmação desabilitado durante a requisição (previne duplo clique)

**SCRUM-45 — Skeleton loading (Nielsen H1)**
- [ ] Skeleton nas 6 telas com fetch: Dashboard, Turmas, Alunos, Detalhes da Turma, Lançamento de Notas e Boletim
- [ ] Skeleton respeita a estrutura visual real da tela
- [ ] Apenas o componente padrão do design system é usado

**SCRUM-46 — Busca em lançamento de notas (Hick)**
- [ ] Campo de busca por nome e matrícula na listagem de alunos da turma
- [ ] Filtragem em tempo real; estado vazio com mensagem específica

**SCRUM-47 — Consistência de aprovação**
- [ ] Média ≥ 6 = "Aprovado" em lançamento, boletim e detalhes da turma
- [ ] Média < 6 = "Reprovado" nas mesmas telas

**SCRUM-48 — Feedback em operações (Nielsen H1)**
- [ ] Botões exibem texto alternativo durante loading: "Entrando...", "Salvando...", "Excluindo..."
- [ ] Botão desabilitado durante a operação

**SCRUM-49 — Recuperação de erros (Nielsen H9)**
- [ ] Erros exibidos com ícone de alerta e fundo vermelho claro
- [ ] Botão "Tentar novamente" disponível nas telas de listagem

**SCRUM-50 — Alvos de toque (Fitts)**
- [ ] Botões primários com largura total em mobile
- [ ] Botões de ícone com área mínima de 40×40px

**SCRUM-51 — Bug fix**
- [ ] Salvar notas funciona corretamente para qualquer professor autenticado
- [ ] Nenhum erro 500 ao acessar o endpoint de notas

**SCRUM-52 e 53 — Controle e reconhecimento (Nielsen H3 / H6)**
- [ ] Botão "Cancelar" retorna à lista sem perder dados de outras telas
- [ ] Nome da turma e do aluno visíveis permanentemente durante o preenchimento

**SCRUM-54 — Tratamento de erro no e-mail**
- [ ] Falha no serviço de e-mail retorna erro 502 com mensagem clara ao usuário
- [ ] Servidor não encerra o processo em caso de falha no envio

---

## Definição de Pronto (DoD) — Sprint 3

- [ ] Todas as heurísticas de Nielsen verificadas manualmente
- [ ] Regra de aprovação (média ≥ 6) consistente em todas as telas
- [ ] Nenhum `window.confirm()` no código de produção
- [ ] Skeleton presente em todas as telas com carregamento assíncrono
- [ ] Bug SCRUM-51 verificado via Postman/Insomnia
- [ ] Build (`vite build`) sem erros de TypeScript
- [ ] Funcionalidades testadas com o usuário demo (`professor@escola.edu.br`)
