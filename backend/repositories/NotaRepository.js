'use strict'
// repositories/NotaRepository.js

const { db, plain, plainAll } = require('../db/connection')

const NotaRepository = {
  findByAluno(alunoId) {
    return plainAll(db.prepare(`
      SELECT n.*, t.disciplina AS materia, t.nome AS turmaNome
      FROM notas_bimestrais n
      JOIN turmas t ON t.id = n.turma_id
      WHERE n.aluno_id = ?
      ORDER BY t.disciplina
    `).all(alunoId))
  },

  findByTurma(turmaId) {
    return plainAll(db.prepare('SELECT * FROM notas_bimestrais WHERE turma_id = ?').all(turmaId))
  },

  findByTurmaAndAluno(turmaId, alunoId) {
    return plain(db.prepare(
      'SELECT * FROM notas_bimestrais WHERE turma_id = ? AND aluno_id = ?'
    ).get(turmaId, alunoId))
  },

  findAllRaw() {
    return plainAll(db.prepare(
      'SELECT bimestre1, bimestre2, bimestre3, bimestre4 FROM notas_bimestrais'
    ).all())
  },

  findByAlunoRaw(alunoId) {
    return plainAll(db.prepare(
      'SELECT bimestre1, bimestre2, bimestre3, bimestre4 FROM notas_bimestrais WHERE aluno_id = ?'
    ).all(alunoId))
  },

  findByTurmaRaw(turmaId) {
    return plainAll(db.prepare(
      'SELECT bimestre1, bimestre2, bimestre3, bimestre4 FROM notas_bimestrais WHERE turma_id = ?'
    ).all(turmaId))
  },

  upsert({ alunoId, turmaId, materia, bimestre1, bimestre2, bimestre3, bimestre4 }) {
    const b1 = bimestre1 ?? null
    const b2 = bimestre2 ?? null
    const b3 = bimestre3 ?? null
    const b4 = bimestre4 ?? null
    const existing = this.findByTurmaAndAluno(turmaId, alunoId)
    if (existing) {
      db.prepare(`
        UPDATE notas_bimestrais
        SET bimestre1 = ?, bimestre2 = ?, bimestre3 = ?, bimestre4 = ?
        WHERE aluno_id = ? AND turma_id = ?
      `).run(b1, b2, b3, b4, alunoId, turmaId)
    } else {
      db.prepare(`
        INSERT INTO notas_bimestrais (aluno_id, turma_id, materia, bimestre1, bimestre2, bimestre3, bimestre4)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(alunoId, turmaId, materia ?? '', b1, b2, b3, b4)
    }
    return this.findByTurmaAndAluno(turmaId, alunoId)
  },
}

module.exports = NotaRepository
