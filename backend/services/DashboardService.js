'use strict'
// services/DashboardService.js
// Responsabilidade única: agregar dados de múltiplos repositórios para o dashboard.

const { db }              = require('../db/connection')
const NotaService         = require('./NotaService')
const AtividadeRepository = require('../repositories/AtividadeRepository')
const PresencaRepository  = require('../repositories/PresencaRepository')

const DashboardService = {
  getSummary() {
    const totalAlunos      = db.prepare('SELECT COUNT(*) AS c FROM alunos').get().c
    const totalTurmas      = db.prepare('SELECT COUNT(*) AS c FROM turmas').get().c
    const atividadesAtivas = AtividadeRepository.countAtivas()

    const hoje       = new Date().toISOString().split('T')[0]
    const presenca   = PresencaRepository.findByData(hoje)
    const presentes  = presenca.filter(p => p.status === 'presente').length
    const taxa       = presenca.length > 0 ? Math.round(presentes / presenca.length * 100) : 0

    return {
      totalAlunos,
      totalTurmas,
      atividadesAtivas,
      presencaHoje: { total: presenca.length, presentes, taxa },
      mediaGeral:          NotaService.mediaGeral(),
      distribuicaoNotas:   NotaService.distribuicao(),
      proximasAtividades:  AtividadeRepository.findProximas(5),
    }
  },
}

module.exports = DashboardService
