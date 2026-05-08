'use strict'
// repositories/AtividadeRepository.js

const { db, plain, plainAll } = require('../db/connection')

const AtividadeRepository = {
  findAll({ turmaId, status } = {}) {
    const where = []
    const params = []
    if (turmaId) { where.push('a.turma_id = ?'); params.push(turmaId) }
    if (status)  { where.push('a.status = ?');   params.push(status)  }
    const sql = `
      SELECT a.*, t.nome AS turmaNome FROM atividades a
      JOIN turmas t ON t.id = a.turma_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY a.data_entrega ASC
    `
    return plainAll(db.prepare(sql).all(...params))
  },

  findProximas(limit = 5) {
    return plainAll(db.prepare(`
      SELECT a.*, t.nome AS turmaNome,
        (SELECT COUNT(*) FROM aluno_turma WHERE turma_id = a.turma_id) AS qtdAlunos
      FROM atividades a JOIN turmas t ON t.id = a.turma_id
      WHERE a.status = 'ativa'
      ORDER BY a.data_entrega ASC LIMIT ?
    `).all(limit))
  },

  findById(id) {
    return plain(db.prepare('SELECT * FROM atividades WHERE id = ?').get(id))
  },

  create({ titulo, turmaId, dataEntrega, status, entregues }) {
    const r = db.prepare(
      'INSERT INTO atividades (titulo, turma_id, data_entrega, status, entregues) VALUES (?, ?, ?, ?, ?)'
    ).run(titulo, turmaId, dataEntrega, status ?? 'ativa', entregues ?? 0)
    return this.findById(r.lastInsertRowid)
  },

  update(id, { status, entregues, titulo, dataEntrega }) {
    const r = db.prepare(`
      UPDATE atividades SET
        status       = CASE WHEN ? IS NOT NULL THEN ? ELSE status       END,
        entregues    = CASE WHEN ? IS NOT NULL THEN ? ELSE entregues    END,
        titulo       = CASE WHEN ? IS NOT NULL THEN ? ELSE titulo       END,
        data_entrega = CASE WHEN ? IS NOT NULL THEN ? ELSE data_entrega END
      WHERE id = ?
    `).run(
      status ?? null, status ?? null, entregues ?? null, entregues ?? null,
      titulo ?? null, titulo ?? null, dataEntrega ?? null, dataEntrega ?? null, id
    )
    return { changes: r.changes, data: r.changes > 0 ? this.findById(id) : null }
  },

  countAtivas() {
    return db.prepare("SELECT COUNT(*) AS c FROM atividades WHERE status = 'ativa'").get().c
  },
}

module.exports = AtividadeRepository
