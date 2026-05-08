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
    db.prepare(`
      INSERT INTO notas_bimestrais (aluno_id, turma_id, materia, bimestre1, bimestre2, bimestre3, bimestre4)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(aluno_id, turma_id) DO UPDATE SET
        bimestre1 = excluded.bimestre1, bimestre2 = excluded.bimestre2,
        bimestre3 = excluded.bimestre3, bimestre4 = excluded.bimestre4
    `).run(alunoId, turmaId, materia ?? '', bimestre1 ?? null, bimestre2 ?? null, bimestre3 ?? null, bimestre4 ?? null)
    return this.findByTurmaAndAluno(turmaId, alunoId)
  },
}

module.exports = NotaRepository
