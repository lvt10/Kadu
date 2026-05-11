'use strict'
const { db }              = require('../db/connection')
const NotaService         = require('./NotaService')
const AtividadeRepository = require('../repositories/AtividadeRepository')
const PresencaRepository  = require('../repositories/PresencaRepository')

const DashboardService = {
  getSummary(professorId) {
    // Conta apenas turmas e alunos do professor
    const totalTurmas = db.prepare(
      'SELECT COUNT(*) AS c FROM turmas WHERE professor_id = ?'
    ).get(professorId).c

    const totalAlunos = db.prepare(`
      SELECT COUNT(DISTINCT at.aluno_id) AS c
      FROM aluno_turma at
      JOIN turmas t ON t.id = at.turma_id
      WHERE t.professor_id = ?
    `).get(professorId).c

    const atividadesAtivas = db.prepare(`
      SELECT COUNT(*) AS c FROM atividades a
      JOIN turmas t ON t.id = a.turma_id
      WHERE t.professor_id = ? AND a.status = 'ativa'
    `).get(professorId).c

    const hoje = new Date().toISOString().split('T')[0]
    const presenca = db.prepare(`
      SELECT rp.status FROM registros_presenca rp
      JOIN turmas t ON t.id = rp.turma_id
      WHERE t.professor_id = ? AND rp.data = ?
    `).all(professorId, hoje)
    const presentes = presenca.filter(p => p.status === 'presente').length
    const taxa = presenca.length > 0 ? Math.round(presentes / presenca.length * 100) : 0

    // Média apenas das notas das turmas do professor
    const notas = db.prepare(`
      SELECT n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4
      FROM notas_bimestrais n
      JOIN turmas t ON t.id = n.turma_id
      WHERE t.professor_id = ?
    `).all(professorId)
    const vals = notas.flatMap(n =>
      [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
    )
    const mediaGeral = vals.length
      ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0

    const faixas = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    for (const v of vals) {
      if (v >= 9)      faixas.A++
      else if (v >= 7) faixas.B++
      else if (v >= 5) faixas.C++
      else if (v >= 3) faixas.D++
      else             faixas.F++
    }

    const proximasAtividades = db.prepare(`
      SELECT a.*, t.nome AS turmaNome,
        (SELECT COUNT(*) FROM aluno_turma WHERE turma_id = a.turma_id) AS qtdAlunos
      FROM atividades a
      JOIN turmas t ON t.id = a.turma_id
      WHERE t.professor_id = ? AND a.status = 'ativa'
      ORDER BY a.data_entrega ASC
      LIMIT 5
    `).all(professorId).map(r => Object.assign({}, r))

    return {
      totalAlunos,
      totalTurmas,
      atividadesAtivas,
      presencaHoje: { total: presenca.length, presentes, taxa },
      mediaGeral,
      distribuicaoNotas: Object.entries(faixas).map(([nota, quantidade]) => ({ nota, quantidade })),
      proximasAtividades,
    }
  },
}

module.exports = DashboardService