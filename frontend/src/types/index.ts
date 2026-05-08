// src/types/index.ts
// Responsabilidade única: definições de tipos compartilhados.
// Elimina a redefinição de interfaces em cada página (violação ISP).

export interface Professor {
  id: number
  nome: string
  email: string
  created_at?: string
}

export interface Turma {
  id: string
  nome: string
  codigo: string
  disciplina: string
  serie: string
  periodo: string
  ano: number
  sala: string
  cor: string
  qtdAlunos: number
  media: number
  alunos?: Aluno[]
}

export interface Aluno {
  id: string
  nome: string
  matricula: string
  email: string
  serie: string
  turmaId?: string
  mediaNotas: number
  turmas?: Turma[]
}

export interface NotaBimestral {
  id?: number
  aluno_id: string
  turma_id: string
  materia?: string
  turmaNome?: string
  bimestre1: number | null
  bimestre2: number | null
  bimestre3: number | null
  bimestre4: number | null
}

export interface Atividade {
  id: number
  titulo: string
  turma_id: string
  turmaNome?: string
  data_entrega: string
  status: 'ativa' | 'encerrada'
  entregues: number
  qtdAlunos?: number
}

export interface RegistroPresenca {
  id?: number
  aluno_id: string
  turma_id: string
  data: string
  status: 'presente' | 'ausente'
}

export interface DashboardData {
  totalAlunos: number
  totalTurmas: number
  atividadesAtivas: number
  presencaHoje: { total: number; presentes: number; taxa: number }
  mediaGeral: number
  distribuicaoNotas: { nota: string; quantidade: number }[]
  proximasAtividades: Atividade[]
}
