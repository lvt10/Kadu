'use strict'
// middleware/auth.js
// Responsabilidade única: validar o token JWT na requisição.

const AuthService = require('../services/AuthService')

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' })
  try {
    req.user = AuthService.verificarToken(token)
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado' })
  }
}

module.exports = auth
