'use strict'
const NotaRepository   = require('../repositories/NotaRepository')
const TurmaRepository  = require('../repositories/TurmaRepository')

function calcularMedia(vals) {
  if (!vals.length) return 0
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
}

const NotaService = {
  // Retorna 0-10 por turma específica
  mediaAlunoPorTurma(alunoId, turmaId) {
    const nota = NotaRepository.findByTurmaAndAluno(turmaId, alunoId)
    if (!nota) return 0
    const vals = [nota.bimestre1, nota.bimestre2, nota.bimestre3, nota.bimestre4]
      .filter(v => v !== null)
    return calcularMedia(vals)
  },

  // Retorna 0-10 média geral do aluno (todas as turmas)
  mediaAluno(alunoId) {
    const notas = NotaRepository.findByAlunoRaw(alunoId)
    const vals = notas.flatMap(n =>
      [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
    )
    return calcularMedia(vals)
  },

  mediaTurma(turmaId) {
    const notas = NotaRepository.findByTurmaRaw(turmaId)
    const vals = notas.flatMap(n =>
      [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
    )
    return calcularMedia(vals)
  },

  mediaGeral() {
    const notas = NotaRepository.findAllRaw()
    const vals = notas.flatMap(n =>
      [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
    )
    return calcularMedia(vals)
  },

  salvar(turmaId, professorId, { alunoId, bimestre1, bimestre2, bimestre3, bimestre4 }) {
    const turma = TurmaRepository.findById(turmaId, professorId)
    return NotaRepository.upsert({ alunoId, turmaId, materia: turma?.disciplina,
      bimestre1, bimestre2, bimestre3, bimestre4 })
  },

  salvarLote(turmaId, professorId, notas) {
    const turma = TurmaRepository.findById(turmaId, professorId)
    return notas.map(n => NotaRepository.upsert({
      alunoId:   n.alunoId,
      turmaId,
      materia:   turma?.disciplina,
      bimestre1: n.bimestre1,
      bimestre2: n.bimestre2,
      bimestre3: n.bimestre3,
      bimestre4: n.bimestre4,
    }))
  },

  distribuicao() {
    const notas = NotaRepository.findAllRaw()
    const vals = notas.flatMap(n =>
      [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
    )
    const faixas = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    for (const v of vals) {
      if (v >= 9)      faixas.A++
      else if (v >= 7) faixas.B++
      else if (v >= 5) faixas.C++
      else if (v >= 3) faixas.D++
      else             faixas.F++
    }
    return Object.entries(faixas).map(([nota, quantidade]) => ({ nota, quantidade }))
  },
}

module.exports = NotaService
