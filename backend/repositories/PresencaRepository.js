'use strict'
// repositories/PresencaRepository.js

const { db, plainAll, transacao } = require('../db/connection')

const PresencaRepository = {
  findAll({ turmaId, data, alunoId } = {}) {
    const where = []
    const params = []
    if (turmaId) { where.push('turma_id = ?'); params.push(turmaId) }
    if (data)    { where.push('data = ?');     params.push(data)    }
    if (alunoId) { where.push('aluno_id = ?'); params.push(alunoId) }
    const sql = `SELECT * FROM registros_presenca${where.length ? ' WHERE ' + where.join(' AND ') : ''}`
    return plainAll(db.prepare(sql).all(...params))
  },

  findByData(data) {
    return plainAll(db.prepare('SELECT status FROM registros_presenca WHERE data = ?').all(data))
  },

  upsertMany(registros) {
    const stmt = db.prepare(`
      INSERT INTO registros_presenca (aluno_id, turma_id, data, status)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(aluno_id, turma_id, data) DO UPDATE SET status = excluded.status
    `)
    let count = 0
    transacao(() => {
      for (const r of registros) {
        if (!r.alunoId || !r.turmaId || !r.data || !r.status) continue
        stmt.run(r.alunoId, r.turmaId, r.data, r.status)
        count++
      }
    })
    return count
  },
}

module.exports = PresencaRepository
