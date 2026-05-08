'use strict'
// services/AuthService.js
// Responsabilidade única: lógica de autenticação (hash, token).
// Não conhece req/res — testável sem HTTP.

const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const ProfessorRepository = require('../repositories/ProfessorRepository')

const JWT_SECRET = process.env.JWT_SECRET || 'escola-secret-dev-key'

const AuthService = {
  login(email, senha) {
    const prof = ProfessorRepository.findByEmail(email)
    if (!prof || !bcrypt.compareSync(senha, prof.senha_hash)) {
      return null
    }
    const token = jwt.sign({ id: prof.id, email: prof.email }, JWT_SECRET, { expiresIn: '7d' })
    return { token, professor: { id: prof.id, nome: prof.nome, email: prof.email } }
  },

  verificarToken(token) {
    return jwt.verify(token, JWT_SECRET)   // lança se inválido
  },
}

module.exports = AuthService
