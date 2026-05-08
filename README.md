# Kadu — Portal do Professor

## Estrutura Completa de Pastas

```
kadu/
│
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml       ← CI/CD → Azure App Service
│       ├── deploy-frontend.yml      ← CI/CD → Azure Static Web Apps
│       └── deploy-landing.yml       ← CI/CD → Vercel
│
├── landing/                         ← Hospedagem: Vercel (gratuito)
│   ├── index.html
│   └── vercel.json
│
├── backend/                         ← Hospedagem: Azure App Service B1
│   ├── db/
│   │   ├── connection.js            ← Abre banco + aplica schema
│   │   └── seed.js                  ← Dados de demonstração
│   ├── repositories/                ← Acesso a dados (DIP)
│   │   ├── AlunoRepository.js
│   │   ├── AtividadeRepository.js
│   │   ├── NotaRepository.js
│   │   ├── PresencaRepository.js
│   │   ├── ProfessorRepository.js
│   │   └── TurmaRepository.js
│   ├── services/                    ← Lógica de negócio (SRP)
│   │   ├── AuthService.js
│   │   ├── DashboardService.js
│   │   └── NotaService.js
│   ├── middleware/
│   │   └── auth.js                  ← Validação JWT
│   ├── routes/                      ← Apenas HTTP (OCP)
│   │   ├── alunos.js
│   │   ├── atividades.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── notas.js
│   │   ├── presenca.js
│   │   └── turmas.js
│   ├── .env.example
│   ├── package.json
│   ├── server.js                    ← Ponto de entrada (30 linhas)
│   └── startup.sh                   ← Script Azure App Service
│
└── frontend/                        ← Hospedagem: Azure Static Web Apps (gratuito)
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── ui/                  ← Componentes shadcn/ui (46 arquivos)
    │   │   │   ├── accordion.tsx
    │   │   │   ├── alert.tsx
    │   │   │   ├── alert-dialog.tsx
    │   │   │   ├── aspect-ratio.tsx
    │   │   │   ├── avatar.tsx
    │   │   │   ├── badge.tsx
    │   │   │   ├── breadcrumb.tsx
    │   │   │   ├── button.tsx
    │   │   │   ├── calendar.tsx
    │   │   │   ├── card.tsx
    │   │   │   ├── carousel.tsx
    │   │   │   ├── chart.tsx
    │   │   │   ├── checkbox.tsx
    │   │   │   ├── collapsible.tsx
    │   │   │   ├── command.tsx
    │   │   │   ├── context-menu.tsx
    │   │   │   ├── dialog.tsx
    │   │   │   ├── drawer.tsx
    │   │   │   ├── dropdown-menu.tsx
    │   │   │   ├── form.tsx
    │   │   │   ├── hover-card.tsx
    │   │   │   ├── input.tsx
    │   │   │   ├── input-otp.tsx
    │   │   │   ├── label.tsx
    │   │   │   ├── menubar.tsx
    │   │   │   ├── navigation-menu.tsx
    │   │   │   ├── pagination.tsx
    │   │   │   ├── popover.tsx
    │   │   │   ├── progress.tsx
    │   │   │   ├── radio-group.tsx
    │   │   │   ├── resizable.tsx
    │   │   │   ├── scroll-area.tsx
    │   │   │   ├── select.tsx
    │   │   │   ├── separator.tsx
    │   │   │   ├── sheet.tsx
    │   │   │   ├── sidebar.tsx
    │   │   │   ├── skeleton.tsx
    │   │   │   ├── slider.tsx
    │   │   │   ├── sonner.tsx
    │   │   │   ├── switch.tsx
    │   │   │   ├── table.tsx
    │   │   │   ├── tabs.tsx
    │   │   │   ├── textarea.tsx
    │   │   │   ├── toggle.tsx
    │   │   │   ├── toggle-group.tsx
    │   │   │   └── tooltip.tsx
    │   │   ├── ImageWithFallback.tsx
    │   │   └── Logo.tsx
    │   ├── hooks/
    │   │   └── index.ts             ← useDashboard, useTurmas, useAlunos, useNotas...
    │   ├── lib/
    │   │   ├── api.ts               ← Cliente HTTP com JWT automático
    │   │   └── utils.ts             ← cn() helper
    │   ├── pages/
    │   │   ├── Alunos.tsx
    │   │   ├── Boletim.tsx
    │   │   ├── CadastroAluno.tsx
    │   │   ├── CadastroTurma.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── DetalhesTurma.tsx
    │   │   ├── Login.tsx
    │   │   ├── NotasLancamento.tsx
    │   │   ├── NotasListaAlunos.tsx
    │   │   ├── NotasListaTurmas.tsx
    │   │   ├── Root.tsx
    │   │   └── Turmas.tsx
    │   ├── types/
    │   │   └── index.ts             ← Todos os tipos TypeScript compartilhados
    │   ├── App.tsx
    │   ├── fonts.css
    │   ├── index.css
    │   ├── main.tsx
    │   ├── routes.tsx
    │   ├── tailwind.css
    │   └── theme.css
    ├── .env.example
    ├── .env.production              ← Editar com URL real do backend
    ├── index.html
    ├── package.json
    ├── staticwebapp.config.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

---

## Setup local (desenvolvimento)

### Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:3001
# → Login: professor@escola.edu.br / demo123
```

### Frontend
```bash
cd frontend

# Criar arquivo .env.local
echo "VITE_API_URL=http://localhost:3001/api" > .env.local

npm install
npm run dev
# → http://localhost:5173
```

### Landing
```bash
# Abrir direto no navegador
open landing/index.html
```

---

## Antes do deploy em produção

1. `frontend/.env.production` → substituir `SEU-BACKEND` pela URL real
2. `landing/index.html` → substituir `SEU-APP.azurestaticapps.net` nas 4 ocorrências
3. Configurar GitHub Secrets conforme documentado

---

## Hospedagem e custos

| Parte    | Plataforma              | Custo      |
|----------|-------------------------|------------|
| Landing  | Vercel                  | Gratuito   |
| Frontend | Azure Static Web Apps   | Gratuito   |
| Backend  | Azure App Service B1    | ~R$ 70/mês |
| Banco    | SQLite em /home/data/   | Incluído   |
# Kadu
# Kadu
