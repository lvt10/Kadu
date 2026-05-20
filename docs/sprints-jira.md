# Estrutura de Sprints — Jira · Projeto Kadu

## Convenções

| Prefixo | Tipo |
|---------|------|
| RN | Regra de Negócio |
| RNF | Requisito Não-Funcional |
| US | User Story |

Escala de pontos: Fibonacci (1, 2, 3, 5, 8, 13)
Formato US: *Como [usuário], quero [ação], para que [benefício].*

---

## Sprint 1 — "Autenticação e Cadastros Base" (Concluída)

| ID | US | RN/RNF | Tag | Pts |
|----|----|--------|-----|-----|
| SCRUM-20 | Como professor, quero que meu e-mail seja único no sistema, para que não haja conflito com outro cadastro. | RN: O e-mail deve ser único | RF: TELA DE LOGIN | — |
| SCRUM-21 | Como professor, quero criar uma senha segura, para que minha conta seja protegida. | RN: Senha com mínimo 8 caracteres, letras e números | RF: TELA DE LOGIN | — |
| SCRUM-33 | Como professor, quero acessar o sistema com e-mail e senha, para que só eu tenha acesso às minhas turmas. | RN: Login deve requisitar e-mail e senha | RF: TELA DE LOGIN | — |
| SCRUM-25 | Como professor, quero que nome e matrícula sejam obrigatórios no cadastro do aluno, para que não haja registros incompletos. | RN04: Campos obrigatórios no cadastro de aluno | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | — |
| SCRUM-27 | Como professor, quero ver apenas os alunos que eu mesmo cadastrei, para que não haja mistura com alunos de outros professores. | RN06: Filtro por Tenant_ID | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | — |
| SCRUM-28 | Como professor, quero navegar entre os campos do formulário usando a tecla Tab, para que o preenchimento seja mais rápido. | RNF03 (Usabilidade): Navegação por Tab | RF1 - TELA DE GERENCIAMENTO DE ALUNOS | — |
| SCRUM-30 | Como professor, quero vincular uma turma a um Ano Letivo, para que eu organize minhas turmas por período. | RN08: Turma vinculada ao Ano Letivo | TELA DE GERENCIAMENTO DE TURMAS | — |
| SCRUM-31 | Como professor, quero matricular um aluno em uma turma, para que eu gerencie quais alunos pertencem a cada turma. | RN09: Enturmar aluno | TELA DE GERENCIAMENTO DE TURMAS | — |
| SCRUM-32 | Como professor, quero que o módulo de turmas esteja sempre disponível, para que eu não perca aulas por instabilidade do sistema. | RNF07 (Disponibilidade): 99,9% uptime | TELA DE GERENCIAMENTO DE TURMAS | — |

---

## Sprint 2 — "Construção do Aplicativo" (Concluída)

**Objetivo:** Construir todas as funcionalidades pedagógicas — dashboard, lançamento de notas e boletim.
**Velocidade:** 32 pontos

---

### SCRUM-34 · 5 pts · TELA DE DASHBOARD

> **US:** Como professor, quero ver um painel com as principais métricas das minhas turmas ao fazer login, para que eu acompanhe o desempenho geral sem precisar navegar por múltiplas telas.

**RN10:** O dashboard deve exibir total de alunos, atividades ativas, taxa de presença do dia e média geral de notas.

**Critérios de Aceite:**
- [ ] Exibe 4 cards: total de alunos, atividades ativas, presença do dia e média geral
- [ ] Dados exibidos são exclusivos do professor autenticado
- [ ] Gráfico de barras com distribuição de notas por faixa de desempenho
- [ ] Lista de próximas atividades com nome da turma e prazo; prazo ≤ 2 dias destacado em vermelho

---

### SCRUM-35 · 3 pts · TELA DE GERENCIAMENTO DE TURMAS

> **US:** Como professor, quero visualizar minhas turmas em cards com quantidade de alunos e média, para que eu identifique rapidamente quais turmas precisam de atenção.

**RN11:** Cada turma deve exibir quantidade de alunos matriculados e média geral de notas.

**Critérios de Aceite:**
- [ ] Card por turma com: nome, disciplina, período, qtd. alunos e média
- [ ] Clicar no card navega para os detalhes da turma
- [ ] Professor pode excluir uma turma

---

### SCRUM-36 · 3 pts · TELA DE GERENCIAMENTO DE TURMAS

> **US:** Como professor, quero ver os detalhes de uma turma com as notas de todos os alunos por bimestre, para que eu tenha uma visão consolidada do desempenho da turma.

**RN12:** A tela de detalhes da turma deve exibir a tabela de notas por bimestre de todos os alunos matriculados.

**Critérios de Aceite:**
- [ ] Tabela com colunas: Aluno, Matrícula, 1º ao 4º Bimestre e Média
- [ ] Em mobile, a tabela é substituída por cards individuais por aluno
- [ ] Exibe "Nenhum aluno matriculado" quando a turma está vazia

---

### SCRUM-37 · 3 pts · RF1 - TELA DE GERENCIAMENTO DE ALUNOS

> **US:** Como professor, quero buscar alunos por nome, e-mail ou matrícula e filtrar por turma, para que eu localize qualquer aluno rapidamente sem percorrer listas longas.

**RN13:** O sistema deve permitir busca combinada por nome, e-mail ou matrícula com filtro por turma.

**Critérios de Aceite:**
- [ ] Campo de busca filtra simultaneamente por nome, e-mail e matrícula (case-insensitive)
- [ ] Dropdown filtra por turma; os dois filtros funcionam em conjunto (AND)
- [ ] Estado vazio distingue "sem alunos cadastrados" de "sem resultados para os filtros"
- [ ] Professor pode excluir um aluno

---

### SCRUM-38 · 8 pts · TELA DE LANÇAMENTO DE NOTAS

> **US:** Como professor, quero lançar e editar as notas de cada bimestre para cada aluno de cada turma, para que eu registre o desempenho pedagógico de forma organizada.

**RN14:** O professor deve poder selecionar turma → aluno → bimestre e registrar a nota correspondente.

**Critérios de Aceite:**
- [ ] Fluxo em 3 etapas: seleciona turma → seleciona aluno → lança nota do bimestre
- [ ] 4 botões de bimestre permitem alternar qual nota está sendo editada
- [ ] Resumo de todos os bimestres visível durante o preenchimento
- [ ] Campo aceita apenas valores entre 0 e 10 com passo de 0,1
- [ ] Ao salvar, exibe confirmação de sucesso e retorna para a lista de alunos da turma

---

### SCRUM-39 · 3 pts · TELA DE LANÇAMENTO DE NOTAS

> **US:** Como professor, quero ver a média do aluno calculada automaticamente enquanto lanço as notas, para que eu saiba o resultado imediatamente sem precisar calcular manualmente.

**RN15:** A média dos bimestres preenchidos deve ser recalculada a cada nota inserida e exibida em tempo real.

**Critérios de Aceite:**
- [ ] Média recalculada a cada keystroke
- [ ] Média exibida em card de destaque com cor correspondente ao desempenho
- [ ] Nome da turma e do aluno visíveis permanentemente durante o preenchimento

---

### SCRUM-40 · 1 pt · TELA DE LANÇAMENTO DE NOTAS

> **US:** Como professor, quero saber se o aluno está aprovado ou reprovado com base na média, para que eu tome as providências pedagógicas necessárias.

**RN16:** Aluno com média ≥ 6 deve ser classificado como "Aprovado"; com média < 6, como "Reprovado".

**Critérios de Aceite:**
- [ ] Média ≥ 6 → status "Aprovado"
- [ ] Média < 6 → status "Reprovado"
- [ ] Status exibido com cor: azul para aprovado, vermelho para reprovado

---

### SCRUM-41 · 3 pts · TELA DO BOLETIM

> **US:** Como professor, quero visualizar e imprimir o boletim completo de um aluno, para que eu entregue um documento formal de desempenho ao aluno ou responsável.

**RN17:** O boletim deve exibir notas por bimestre, média por disciplina e média geral; deve ser imprimível.

**Critérios de Aceite:**
- [ ] Exibe: nome, matrícula, série e professor responsável do aluno
- [ ] Tabela com 1º ao 4º Bimestre, Média e Status por disciplina
- [ ] Linha de rodapé com Média Geral entre todas as disciplinas
- [ ] Botão "Imprimir" oculta sidebar e navegação; exibe apenas o conteúdo pedagógico

**Total Sprint 2: 32 pontos**

---

## Sprint 3 — "Refatoração e Qualidade de UX" (Concluída)

**Objetivo:** Elevar a qualidade do sistema aplicando as 10 Heurísticas de Nielsen, princípios SOLID e consistência visual em todas as telas.
**Velocidade:** 21 pontos

---

### SCRUM-42 · 3 pts · REFATORAÇÃO / SOLID

> **US:** Como professor, quero que a classificação de notas seja idêntica em todas as telas do sistema, para que eu não veja informações contraditórias ao navegar.

**RNF08 (Manutenibilidade — SOLID SRP/DIP):** A lógica de cor e status de notas deve ser centralizada em um único módulo, eliminando duplicação entre telas.

**Critérios de Aceite:**
- [ ] Um único módulo define os limiares de cor e status de notas para todo o sistema
- [ ] Todas as telas consomem esse módulo; nenhum limiar duplicado no código
- [ ] Qualquer alteração no limiar reflete automaticamente em todas as telas

---

### SCRUM-43 · 2 pts · REFATORAÇÃO / UX

> **US:** Como professor, quero ver um diálogo de confirmação claro ao excluir um registro, para que eu não apague dados por acidente.

**RNF09 (Usabilidade — Nielsen H4 Consistência):** Todas as ações destrutivas devem usar diálogo de confirmação visual consistente com o design system, substituindo o alerta nativo do browser.

**Critérios de Aceite:**
- [ ] Nenhum alerta nativo do browser (`window.confirm`) no sistema
- [ ] Diálogo exibe o nome do item a ser excluído e "Esta ação não pode ser desfeita"
- [ ] Botão de confirmação em vermelho; botão "Cancelar" fecha sem executar nenhuma ação
- [ ] Botão de confirmação desabilitado durante a requisição (previne duplo clique)

---

### SCRUM-44 · 3 pts · REFATORAÇÃO / UX

> **US:** Como professor, quero ver o sistema reagindo enquanto os dados carregam, para que eu saiba que a ação foi processada e não fique na dúvida se a tela travou.

**RNF10 (Usabilidade — Nielsen H1 Visibilidade do Status):** Todas as telas com carregamento de dados devem exibir skeleton animado no lugar do conteúdo enquanto aguardam resposta do servidor.

**Critérios de Aceite:**
- [ ] Skeleton animado nas 6 telas com fetch assíncrono: Dashboard, Turmas, Alunos, Detalhes da Turma, Lançamento de Notas e Boletim
- [ ] Skeleton respeita a estrutura visual real da tela (mesmo número de cards e proporções)
- [ ] Skeleton desaparece assim que os dados chegam

---

### SCRUM-45 · 2 pts · REFATORAÇÃO / UX

> **US:** Como professor, quero buscar um aluno por nome ou matrícula diretamente na listagem da turma antes de lançar nota, para que eu não precise percorrer listas longas.

**RNF11 (Usabilidade — Nielsen H7 + Lei de Hick):** O professor deve poder buscar um aluno diretamente na listagem de alunos da turma antes de lançar nota.

**Critérios de Aceite:**
- [ ] Campo de busca por nome e matrícula na listagem de alunos da turma
- [ ] Filtragem em tempo real
- [ ] Estado vazio com mensagem específica quando nenhum aluno é encontrado

---

### SCRUM-46 · 1 pt · REFATORAÇÃO / UX

> **US:** Como professor, quero que a aprovação do aluno seja calculada da mesma forma em todas as telas, para que eu confie nas informações que o sistema exibe.

**RNF12 (Usabilidade — Nielsen H4 Consistência):** A classificação "Aprovado"/"Reprovado" com média ≥ 6 deve ser idêntica em lançamento de notas, boletim e detalhes da turma.

**Critérios de Aceite:**
- [ ] Média ≥ 6 = "Aprovado" em todas as telas
- [ ] Média < 6 = "Reprovado" em todas as telas
- [ ] Nenhuma tela exibe status diferente para a mesma média

---

### SCRUM-47 · 1 pt · REFATORAÇÃO / UX

> **US:** Como professor, quero ver o botão de ação mudar enquanto o sistema processa minha solicitação, para que eu saiba que está funcionando e não clique novamente por engano.

**RNF13 (Usabilidade — Nielsen H1 Visibilidade do Status):** O sistema deve exibir feedback visual no botão de ação durante operações assíncronas.

**Critérios de Aceite:**
- [ ] Botões exibem texto alternativo durante loading: "Salvando...", "Excluindo...", "Entrando..."
- [ ] Botão desabilitado durante a operação para evitar duplo envio

---

### SCRUM-48 · 2 pts · REFATORAÇÃO / UX

> **US:** Como professor, quero ver mensagens de erro claras com a opção de tentar novamente, para que eu saiba o que aconteceu e consiga continuar usando o sistema.

**RNF14 (Usabilidade — Nielsen H9 Recuperação de Erros):** Mensagens de erro devem ser exibidas com ícone, destaque visual e opção de tentar novamente.

**Critérios de Aceite:**
- [ ] Erros exibidos com ícone de alerta e fundo vermelho claro
- [ ] Botão "Tentar novamente" disponível nas telas de listagem
- [ ] Mensagem contextualiza o que falhou (ex: "Erro ao carregar alunos")

---

### SCRUM-49 · 1 pt · REFATORAÇÃO / UX

> **US:** Como professor usando o sistema no celular, quero que os botões principais sejam fáceis de tocar, para que eu não cometa erros de toque durante o uso.

**RNF15 (Usabilidade — Lei de Fitts):** Botões de ação primária devem ocupar largura total em mobile; botões de ícone devem ter área mínima de toque de 40×40px.

**Critérios de Aceite:**
- [ ] Botões de submit com largura total (`w-full`) em mobile
- [ ] Botões de ícone (excluir, voltar) com área mínima de 40×40px

---

### SCRUM-50 · 1 pt · BUG FIX

> **US:** Como professor, quero que o salvamento de notas funcione corretamente, para que eu não perca o trabalho de lançamento por erros do sistema.

**BUG:** O endpoint de salvar notas retornava erro 500 pois o identificador do professor não era enviado corretamente ao consultar os dados da turma.

**Critérios de Aceite:**
- [ ] Salvar notas funciona corretamente para qualquer professor autenticado
- [ ] Nenhum erro 500 ao acessar o endpoint de notas
- [ ] A disciplina da turma é salva corretamente junto com as notas

---

### SCRUM-51 · 2 pts · REFATORAÇÃO / UX

> **US:** Como professor, quero poder cancelar o lançamento de notas a qualquer momento, para que eu tenha controle sobre o que estou fazendo sem medo de cometer erros.

**RNF16 (Usabilidade — Nielsen H3 Controle e Liberdade):** O professor deve poder cancelar o lançamento e retornar à lista de alunos sem perder dados de outras telas.

**Critérios de Aceite:**
- [ ] Botão "Cancelar" disponível durante o lançamento de notas
- [ ] "Cancelar" retorna para a listagem de alunos da turma sem salvar
- [ ] Botão "Voltar" disponível em todas as telas de detalhe

---

### SCRUM-52 · 1 pt · REFATORAÇÃO / UX

> **US:** Como professor, quero ver o nome da turma e do aluno durante todo o preenchimento de notas, para que eu tenha certeza de que estou editando o aluno correto.

**RNF17 (Usabilidade — Nielsen H6 Reconhecimento):** O nome da turma e do aluno devem permanecer visíveis no cabeçalho durante todo o lançamento de notas.

**Critérios de Aceite:**
- [ ] Cabeçalho exibe `{nomeTurma} • {nomeAluno}` permanentemente
- [ ] Cards de contexto (Aluno, Turma, Média) visíveis durante o preenchimento

---

### SCRUM-53 · 2 pts · REFATORAÇÃO / BACKEND

> **US:** Como professor, quero ser avisado quando há problema no envio de e-mail, para que eu saiba que preciso tentar novamente em vez de ficar aguardando um e-mail que não chegará.

**RNF18 (Confiabilidade):** Uma falha no serviço de e-mail deve retornar erro claro ao usuário sem derrubar o servidor.

**Critérios de Aceite:**
- [ ] Falha no envio retorna erro 502 com mensagem clara: "Não foi possível enviar o e-mail. Tente novamente."
- [ ] Servidor não encerra o processo em caso de falha no envio
- [ ] Erro registrado no log do servidor com detalhes da falha

**Total Sprint 3: 21 pontos**

---

## Resumo Geral

| Sprint | Foco | Itens | Pontos |
|--------|------|-------|--------|
| Sprint 1 | Autenticação e cadastros base | 9 | — |
| Sprint 2 | Construção do aplicativo | 9 | 32 |
| Sprint 3 | Refatoração UX / SOLID | 12 | 21 |
| **Total** | | **30** | **53** |
