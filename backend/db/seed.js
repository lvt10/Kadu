'use strict'
// db/seed.js
// Responsabilidade única: garantir dados de demonstração na primeira execução.

const bcrypt = require('bcryptjs')
const { db } = require('./connection')

function seed() {
  const demoEmail = 'professor@escola.edu.br'
  const existe = db.prepare('SELECT id FROM professores WHERE email = ?').get(demoEmail)
  if (!existe) {
    const hash = bcrypt.hashSync('demo123', 10)
    db.prepare('INSERT INTO professores (nome, email, senha_hash) VALUES (?, ?, ?)')
      .run('Prof. Paula Silva', demoEmail, hash)
    console.log('👤 Professor demo criado — professor@escola.edu.br | demo123')
  }
}

module.exports = { seed }
