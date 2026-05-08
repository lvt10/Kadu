'use strict'
// repositories/ProfessorRepository.js
// Responsabilidade única: acesso a dados de professores.
// Routes e Services nunca tocam no db diretamente para este domínio.

const { db, plain } = require('../db/connection')

const ProfessorRepository = {
  findByEmail(email) {
    return plain(db.prepare('SELECT * FROM professores WHERE email = ?').get(email))
  },
  findById(id) {
    return plain(db.prepare('SELECT id, nome, email, created_at FROM professores WHERE id = ?').get(id))
  },
}

module.exports = ProfessorRepository
