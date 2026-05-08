'use strict'
// routes/presenca.js
const router = require('express').Router()
const auth   = require('../middleware/auth')
const repo   = require('../repositories/PresencaRepository')

router.get('/', auth, (req, res) => {
  res.json(repo.findAll(req.query))
})

router.post('/', auth, (req, res) => {
  const registros = Array.isArray(req.body) ? req.body : [req.body]
  const quantidade = repo.upsertMany(registros)
  res.json({ mensagem: 'Presença registrada', quantidade })
})

module.exports = router
