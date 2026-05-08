'use strict'
// repositories/TurmaRepository.js

const { db, plain, plainAll } = require('../db/connection')

const TurmaRepository = {
  findAll() {
    return plainAll(db.prepare(`
      SELECT t.*, COUNT(at.aluno_id) AS qtdAlunos
      FROM turmas t
      LEFT JOIN aluno_turma at ON at.turma_id = t.id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `).all())
  },

  findById(id) {
    return plain(db.prepare(`
      SELECT t.*, COUNT(at.aluno_id) AS qtdAlunos
      FROM turmas t
      LEFT JOIN aluno_turma at ON at.turma_id = t.id
      WHERE t.id = ?
      GROUP BY t.id
    `).get(id))
  },

  findAlunosByTurma(turmaId) {
    return plainAll(db.prepare(`
      SELECT a.* FROM alunos a
      JOIN aluno_turma at ON at.aluno_id = a.id
      WHERE at.turma_id = ?
      ORDER BY a.nome
    `).all(turmaId))
  },

  create({ id, nome, codigo, disciplina, serie, periodo, ano, sala, cor, professorId }) {
    db.prepare(`
      INSERT INTO turmas (id, nome, codigo, disciplina, serie, periodo, ano, sala, cor, professor_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, nome, codigo, disciplina, serie, periodo, Number(ano), sala ?? '', cor ?? 'bg-blue-500', professorId)
    return plain(db.prepare('SELECT * FROM turmas WHERE id = ?').get(id))
  },

  delete(id) {
    return db.prepare('DELETE FROM turmas WHERE id = ?').run(id).changes
  },
}

module.exports = TurmaRepository
