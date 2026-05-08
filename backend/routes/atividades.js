'use strict'
// routes/atividades.js
const router = require('express').Router()
const auth   = require('../middleware/auth')
const repo   = require('../repositories/AtividadeRepository')

router.get('/', auth, (req, res) => {
  res.json(repo.findAll(req.query))
})

router.post('/', auth, (req, res) => {
  const { titulo, turmaId, dataEntrega } = req.body
  if (!titulo || !turmaId || !dataEntrega)
    return res.status(400).json({ erro: 'titulo, turmaId e dataEntrega são obrigatórios' })
  res.status(201).json(repo.create(req.body))
})

router.put('/:id', auth, (req, res) => {
  const { changes, data } = repo.update(req.params.id, req.body)
  if (!changes) return res.status(404).json({ erro: 'Atividade não encontrada' })
  res.json(data)
})

module.exports = router
