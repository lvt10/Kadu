'use strict'
const { db, plain, plainAll, transacao } = require('../db/connection')

const AlunoRepository = {
  // Retorna alunos apenas das turmas do professor
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
    `).all(professorId, professorId))
  },

  findByTurma(turmaId) {
    return plainAll(db.prepare(`
      SELECT a.*, at.turma_id AS turmaId
      FROM alunos a
      JOIN aluno_turma at ON at.aluno_id = a.id
      WHERE at.turma_id = ?
      ORDER BY a.nome
    `).all(turmaId))
  },

  findById(id) {
    return plain(db.prepare('SELECT * FROM alunos WHERE id = ?').get(id))
  },

  findTurmasByAluno(alunoId) {
    return plainAll(db.prepare(`
      SELECT t.* FROM turmas t
      JOIN aluno_turma at ON at.turma_id = t.id
      WHERE at.aluno_id = ?
    `).all(alunoId))
  },

  create({ id, nome, matricula, email, serie, turmaIds }) {
    transacao(() => {
      let serieAluno = serie ?? ''
      if (!serieAluno && turmaIds?.length) {
        const t = plain(db.prepare('SELECT serie FROM turmas WHERE id = ?').get(turmaIds[0]))
        if (t) serieAluno = t.serie
      }
      db.prepare('INSERT INTO alunos (id, nome, matricula, email, serie) VALUES (?, ?, ?, ?, ?)')
        .run(id, nome, matricula, email ?? '', serieAluno)
      if (turmaIds?.length) {
        const link = db.prepare('INSERT OR IGNORE INTO aluno_turma (aluno_id, turma_id) VALUES (?, ?)')
        for (const tid of turmaIds) link.run(id, tid)
      }
    })
    return plain(db.prepare('SELECT * FROM alunos WHERE id = ?').get(id))
  },

  update(id, { nome, email, serie }) {
    db.prepare(`
      UPDATE alunos SET
        nome  = CASE WHEN ? IS NOT NULL THEN ? ELSE nome  END,
        email = CASE WHEN ? IS NOT NULL THEN ? ELSE email END,
        serie = CASE WHEN ? IS NOT NULL THEN ? ELSE serie END
      WHERE id = ?
    `).run(nome ?? null, nome ?? null, email ?? null, email ?? null, serie ?? null, serie ?? null, id)
    return plain(db.prepare('SELECT * FROM alunos WHERE id = ?').get(id))
  },

  delete(id) {
    return db.prepare('DELETE FROM alunos WHERE id = ?').run(id).changes
  },
}

module.exports = AlunoRepository