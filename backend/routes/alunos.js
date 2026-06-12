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
    mediaNotas: turmaId ? NotaService.mediaAlunoTurma(a.id, turmaId) : null
  })))
})

router.post('/', auth, (req, res) => {
  const { nome, matricula, turmaIds, pcd } = req.body
  if (!nome || !matricula) return res.status(400).json({ error: 'Nome e Matrícula obrigatórios' })

  const id = randomUUID()
  repo.create({ id, nome, matricula, pcd })

  if (Array.isArray(turmaIds)) {
    turmaIds.forEach(tId => repo.vincularTurma(id, tId))
  }
  res.status(201).json({ id, nome, matricula, pcd })
})

module.exports = router
