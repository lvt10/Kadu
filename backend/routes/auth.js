'use strict'
// routes/auth.js
const router       = require('express').Router()
const auth         = require('../middleware/auth')
const AuthService  = require('../services/AuthService')
const ProfessorRepository = require('../repositories/ProfessorRepository')

router.post('/login', (req, res) => {
  const { email, senha } = req.body
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios' })
  const result = AuthService.login(email, senha)
  if (!result) return res.status(401).json({ erro: 'Email ou senha inválidos' })
  res.json(result)
})

router.get('/me', auth, (req, res) => {
  const prof = ProfessorRepository.findById(req.user.id)
  if (!prof) return res.status(404).json({ erro: 'Não encontrado' })
  res.json(prof)
})

module.exports = router
