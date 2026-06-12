'use strict'
// routes/notas.js
const router = require('express').Router()
const auth   = require('../middleware/auth')
const repo   = require('../repositories/NotaRepository')
const TurmaRepository = require('../repositories/TurmaRepository')
const NotaService = require('../services/NotaService')

router.get('/aluno/:alunoId', auth, (req, res) => {
  const notas = repo.findByAluno(req.params.alunoId)
  res.json(notas.map(n => ({ ...n, mediaTurma: NotaService.mediaTurma(n.turma_id) })))
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
    const turma = TurmaRepository.findById(turmaId, req.user.id)
    const nota  = repo.upsert({ alunoId, turmaId, materia: turma?.disciplina, bimestre1, bimestre2, bimestre3, bimestre4 })
    res.json(nota)
  } catch (e) {
    console.error('Erro ao salvar nota:', e.message)
    res.status(500).json({ erro: 'Erro ao salvar notas. Tente novamente.' })
  }
})

// Salva notas de múltiplos alunos de uma turma de uma vez
router.post('/turma/:turmaId/batch', auth, (req, res) => {
  const { turmaId } = req.params
  const { notas } = req.body // [{ alunoId, bimestre1, bimestre2, bimestre3, bimestre4 }]
  if (!Array.isArray(notas)) return res.status(400).json({ erro: 'notas deve ser um array' })
  try {
    const turma = TurmaRepository.findById(turmaId, req.user.id)
    const saved = notas.map(n =>
      repo.upsert({ alunoId: n.alunoId, turmaId, materia: turma?.disciplina,
        bimestre1: n.bimestre1, bimestre2: n.bimestre2, bimestre3: n.bimestre3, bimestre4: n.bimestre4 })
    )
    res.json(saved)
  } catch (e) {
    console.error('Erro ao salvar notas em lote:', e.message)
    res.status(500).json({ erro: 'Erro ao salvar notas. Tente novamente.' })
  }
})

module.exports = router
