'use strict'
const router      = require('express').Router()
const auth        = require('../middleware/auth')
const repo        = require('../repositories/AlunoRepository')
const NotaService = require('../services/NotaService')
const { randomUUID } = require('crypto')

router.get('/', auth, (req, res) => {
  const { turmaId } = req.query
  const alunos = turmaId ? repo.findByTurma(turmaId) : repo.findAll(req.user.id)
  res.json(alunos.map(a => ({
    ...a,
    mediaNotas: turmaId ? NotaService.mediaAlunoPorTurma(a.id, turmaId) : 0
  })))
})

router.post('/', auth, (req, res) => {
  const { nome, matricula, email, serie, turmas: turmaIds } = req.body
  if (!nome || !matricula) return res.status(400).json({ erro: 'Nome e matrícula são obrigatórios' })
  try {
    const aluno = repo.create({ id: randomUUID(), nome, matricula, email, serie, turmaIds })
    res.status(201).json({ ...aluno, mediaNotas: 0 })
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return res.status(409).json({ erro: 'Matrícula já cadastrada' })
    throw e
  }
})

router.get('/:id', auth, (req, res) => {
  const aluno = repo.findById(req.params.id)
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' })
  const turmas = repo.findTurmasByAluno(req.params.id)
  res.json({ ...aluno, turmas, mediaNotas: NotaService.mediaAluno(req.params.id) })
})

router.put('/:id', auth, (req, res) => {
  if (!repo.findById(req.params.id)) return res.status(404).json({ erro: 'Aluno não encontrado' })
  res.json(repo.update(req.params.id, req.body))
})

router.delete('/:id', auth, (req, res) => {
  if (!repo.delete(req.params.id)) return res.status(404).json({ erro: 'Aluno não encontrado' })
  res.json({ mensagem: 'Aluno removido com sucesso' })
})

module.exports = router