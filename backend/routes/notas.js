'use strict'
const router = require('express').Router()
const auth   = require('../middleware/auth')
const repo   = require('../repositories/NotaRepository')
const { db, plainAll } = require('../db/connection')

// Retorna o boletim incluindo a média global de todas as turmas para aquela matéria
router.get('/aluno/:alunoId', auth, (req, res) => {
  const notas = repo.findByAluno(req.params.alunoId)
  
  // Calcula dinamicamente as médias daquela matéria na escola/turma como contexto
  const boletimProcessado = notas.map(n => {
    const estatisticas = plainAll(db.prepare(`
      SELECT b1, b2, b3, b4 FROM notas WHERE materia = ?
    `).all(n.materia))

    let somaGeral = 0, qtd = 0
    estatisticas.forEach(e => {
      [e.b1, e.b2, e.b3, e.b4].forEach(v => {
        if (v !== null) { somaGeral += v; qtd++; }
      })
    })
    
    return {
      ...n,
      media_turma: qtd > 0 ? parseFloat((somaGeral / qtd).toFixed(1)) : 0
    }
  })

  res.json(boletimProcessado)
})

// Novo endpoint para salvar as notas em lote (Lançamento matricial por turma/matéria)
router.post('/lote', auth, (req, res) => {
  const { turmaId, materia, notas } = req.body
  if (!turmaId || !materia || !notas) return res.status(400).json({ error: 'Dados incompletos' })

  // 'notas' estruturado como: { [alunoId]: { b1, b2, b3, b4 } }
  Object.keys(notas).forEach(alunoId => {
    const { b1, b2, b3, b4 } = notas[alunoId]
    
    // Verifica se registro de nota do aluno já existe
    const existe = db.prepare('SELECT id FROM notas WHERE aluno_id = ? AND materia = ?').get(alunoId, materia)

    const v1 = b1 === '' || b1 === undefined ? null : parseFloat(b1)
    const v2 = b2 === '' || b2 === undefined ? null : parseFloat(b2)
    const v3 = b3 === '' || b3 === undefined ? null : parseFloat(b3)
    const v4 = b4 === '' || b4 === undefined ? null : parseFloat(b4)

    if (existe) {
      db.prepare('UPDATE notas SET b1 = ?, b2 = ?, b3 = ?, b4 = ? WHERE aluno_id = ? AND materia = ?')
        .run(v1, v2, v3, v4, alunoId, materia)
    } else {
      db.prepare('INSERT INTO notas (aluno_id, materia, b1, b2, b3, b4) VALUES (?, ?, ?, ?, ?, ?)')
        .run(alunoId, materia, v1, v2, v3, v4)
    }
  })

  res.json({ message: 'Notas salvas com sucesso em lote!' })
})

module.exports = router
