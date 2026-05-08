'use strict'
// services/NotaService.js
// Responsabilidade única: cálculos de médias.
// Separado do repositório pois é lógica de negócio pura, sem SQL.

const NotaRepository = require('../repositories/NotaRepository')

function calcularMediaDeBimestres(notas) {
  const vals = notas.flatMap(n =>
    [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null)
  )
  if (!vals.length) return 0
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
}

const NotaService = {
  // Escala 0-100 (compatível com o frontend)
  mediaAluno(alunoId) {
    const notas = NotaRepository.findByAlunoRaw(alunoId)
    return calcularMediaDeBimestres(notas) * 10
  },

  // Escala 0-10
  mediaTurma(turmaId) {
    const notas = NotaRepository.findByTurmaRaw(turmaId)
    return calcularMediaDeBimestres(notas)
  },

  // Escala 0-10 para dashboard
  mediaGeral() {
    const notas = NotaRepository.findAllRaw()
    return calcularMediaDeBimestres(notas)
  },

  distribuicao() {
    const notas = NotaRepository.findAllRaw()
    const vals  = notas.flatMap(n =>
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
