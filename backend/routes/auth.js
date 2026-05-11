'use strict'
const router       = require('express').Router()
const auth         = require('../middleware/auth')
const AuthService  = require('../services/AuthService')
const ProfessorRepository = require('../repositories/ProfessorRepository')
const bcrypt       = require('bcryptjs')
const { db }       = require('../db/connection')

router.post('/login', (req, res) => {
  const { email, senha } = req.body
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios' })
  const result = AuthService.login(email, senha)
  if (!result) return res.status(401).json({ erro: 'Email ou senha inválidos' })
  res.json(result)
})

router.post('/registro', (req, res) => {
  const { nome, email, senha } = req.body
  if (!nome || !email || !senha)
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' })
  if (senha.length < 6)
    return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres' })

  const existe = ProfessorRepository.findByEmail(email)
  if (existe) return res.status(409).json({ erro: 'Este email já está cadastrado' })

  const hash = bcrypt.hashSync(senha, 10)
  db.prepare('INSERT INTO professores (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(nome, email, hash)

  const result = AuthService.login(email, senha)
  res.status(201).json(result)
})

router.get('/me', auth, (req, res) => {
  const prof = ProfessorRepository.findById(req.user.id)
  if (!prof) return res.status(404).json({ erro: 'Não encontrado' })
  res.json(prof)
})

module.exports = router
