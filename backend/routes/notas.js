'use strict'
// routes/notas.js
const router = require('express').Router()
const auth = require('../middleware/auth')
const repo = require('../repositories/NotaRepository')
const svc  = require('../services/NotaService')

router.get('/aluno/:alunoId', auth, (req, res) => {
  const notas = repo.findByAluno(req.params.alunoId)
  res.json(notas.map(n => ({ ...n, mediaTurma: svc.mediaTurma(n.turma_id) })))
})

router.get('/turma/:turmaId', auth, (req, res) => {
  res.json(repo.findByTurma(req.params.turmaId))
})

router.get('/turma/:turmaId/aluno/:alunoId', auth, (req, res) => {
  const nota = repo.findByTurmaAndAluno(req.params.turmaId, req.params.alunoId)
  res.json(nota ?? { bimestre1: null, bimestre2: null, bimestre3: null, bimestre4: null })
})

router.post('/', auth, (req, res) => {
  const { alunoId, turmaId, bimestre1, bimestre2, bimestre3, bimestre4 } = req.body
  if (!alunoId || !turmaId) return res.status(400).json({ erro: 'alunoId e turmaId obrigatórios' })
  try {
    res.json(svc.salvar(turmaId, req.user.id, { alunoId, bimestre1, bimestre2, bimestre3, bimestre4 }))
  } catch (e) {
    console.error('Erro ao salvar nota:', e.message)
    res.status(500).json({ erro: 'Erro ao salvar notas. Tente novamente.' })
  }
})

router.post('/turma/:turmaId/batch', auth, (req, res) => {
  if (!Array.isArray(req.body.notas)) return res.status(400).json({ erro: 'notas deve ser um array' })
  try {
    res.json(svc.salvarLote(req.params.turmaId, req.user.id, req.body.notas))
  } catch (e) {
    console.error('Erro ao salvar notas em lote:', e.message)
    res.status(500).json({ erro: 'Erro ao salvar notas. Tente novamente.' })
  }
})

module.exports = router
