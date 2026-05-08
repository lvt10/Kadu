'use strict'
// server.js — ponto de entrada.
// Responsabilidade única: montar o app e escutar na porta.
// Não contém lógica de negócio, SQL ou regras de auth.

const express = require('express')
const cors    = require('cors')

require('./db/connection')          // abre banco e aplica schema
require('./db/seed').seed()         // dados de demonstração

const app  = express()
const PORT = process.env.PORT || 3001

const origens = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000,http://localhost:4173')
  .split(',').map(o => o.trim())

app.use(cors({ origin: origens }))
app.use(express.json())

app.use('/api/auth',      require('./routes/auth'))
app.use('/api/turmas',    require('./routes/turmas'))
app.use('/api/alunos',    require('./routes/alunos'))
app.use('/api/notas',     require('./routes/notas'))
app.use('/api/atividades',require('./routes/atividades'))
app.use('/api/presenca',  require('./routes/presenca'))
app.use('/api/dashboard', require('./routes/dashboard'))
app.get('/api/health',    (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('Erro:', err.message)
  res.status(500).json({ erro: 'Erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`)
  console.log(`🗄️  Banco: ${process.env.DB_PATH || './escola.db'}`)
  console.log(`📧 Demo: professor@escola.edu.br | senha: demo123\n`)
})
