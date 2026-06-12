'use strict'
const { db, plain, plainAll, transacao } = require('../db/connection')

const AlunoRepository = {
  findAll(professorId) {
    return plainAll(db.prepare(`
      SELECT DISTINCT a.*,
        (SELECT at2.turma_id FROM aluno_turma at2
         JOIN turmas t2 ON t2.id = at2.turma_id
         WHERE at2.aluno_id = a.id AND t2.professor_id = ?
         LIMIT 1) AS turmaId
      FROM alunos a
      JOIN aluno_turma at ON at.aluno_id = a.id
      JOIN turmas t ON t.id = at.turma_id
      WHERE t.professor_id = ?
      ORDER BY a.nome
    `).all(professorId, professorId)).map(a => ({ ...a, pcd: !!a.pcd }))
  },

  findByTurma(turmaId) {
    return plainAll(db.prepare(`
      SELECT a.* FROM alunos a
      JOIN aluno_turma at ON at.aluno_id = a.id
      WHERE at.turma_id = ?
      ORDER BY a.nome
    `).all(turmaId)).map(a => ({ ...a, pcd: !!a.pcd }))
  },

  findById(id) {
    const a = plain(db.prepare('SELECT * FROM alunos WHERE id = ?').get(id))
    return a ? { ...a, pcd: !!a.pcd } : null
  },

  create(aluno) {
    const { id, nome, matricula, pcd } = aluno
    db.prepare('INSERT INTO alunos (id, nome, matricula, pcd) VALUES (?, ?, ?, ?)')
      .run(id, nome, matricula, pcd ? 1 : 0)
    return id
  },

  update(id, aluno) {
    const { nome, matricula, pcd } = aluno
    db.prepare('UPDATE alunos SET nome = ?, matricula = ?, pcd = ? WHERE id = ?')
      .run(nome, matricula, pcd ? 1 : 0, id)
    return true
  },

  vincularTurma(alunoId, turmaId) {
    db.prepare('INSERT OR IGNORE INTO aluno_turma (aluno_id, turma_id) VALUES (?, ?)')
      .run(alunoId, turmaId)
  },

  limparTurmas(alunoId) {
    db.prepare('DELETE FROM aluno_turma WHERE aluno_id = ?').run(alunoId)
  }
}

module.exports = AlunoRepository
