'use strict'
// routes/turmas.js
const router    = require('express').Router()
const auth      = require('../middleware/auth')
const repo      = require('../repositories/TurmaRepository')
const NotaService = require('../services/NotaService')
const { randomUUID } = require('crypto')

router.get('/', auth, (req, res) => {
  const turmas = repo.findAll()
  res.json(turmas.map(t => ({ ...t, media: NotaService.mediaTurma(t.id) })))
})

router.post('/', auth, (req, res) => {
  const { nome, codigo, disciplina, serie, periodo, ano, sala, cor } = req.body
  if (!nome || !codigo || !disciplina || !serie || !periodo || !ano)
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, codigo, disciplina, serie, periodo, ano' })
  try {
    const turma = repo.create({ id: randomUUID(), nome, codigo, disciplina, serie, periodo, ano, sala, cor, professorId: req.user.id })
    res.status(201).json({ ...turma, qtdAlunos: 0, media: 0 })
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return res.status(409).json({ erro: 'Código de turma já existe' })
    throw e
  }
})

router.get('/:id', auth, (req, res) => {
  const turma = repo.findById(req.params.id)
  if (!turma) return res.status(404).json({ erro: 'Turma não encontrada' })
  const alunos = repo.findAlunosByTurma(req.params.id)
    .map(a => ({ ...a, mediaNotas: NotaService.mediaAluno(a.id) }))
  res.json({ ...turma, media: NotaService.mediaTurma(req.params.id), alunos })
})

router.delete('/:id', auth, (req, res) => {
  if (!repo.delete(req.params.id)) return res.status(404).json({ erro: 'Turma não encontrada' })
  res.json({ mensagem: 'Turma removida com sucesso' })
})

module.exports = router
