// src/hooks/index.ts
// Responsabilidade única de cada hook: buscar e gerenciar estado de um domínio.
// Páginas ficam com responsabilidade única: apenas renderizar.

import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { Turma, Aluno, NotaBimestral, DashboardData } from '../types'

// ── useDashboard ──────────────────────────────────────────────
export function useDashboard() {
  const [data,    setData]    = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    api.get<DashboardData>('/dashboard')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

// ── useTurmas ─────────────────────────────────────────────────
export function useTurmas() {
  const [turmas,  setTurmas]  = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    api.get<Turma[]>('/turmas')
      .then(setTurmas)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { turmas, loading, error }
}

// ── useTurma (single) ─────────────────────────────────────────
export function useTurma(id: string | undefined) {
  const [turma,   setTurma]   = useState<Turma | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.get<Turma>(`/turmas/${id}`)
      .then(setTurma)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return { turma, loading, error }
}

// ── useAlunos ─────────────────────────────────────────────────
export function useAlunos(turmaId?: string) {
  const [alunos,  setAlunos]  = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    const url = turmaId ? `/alunos?turmaId=${turmaId}` : '/alunos'
    api.get<Aluno[]>(url)
      .then(setAlunos)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [turmaId])

  return { alunos, loading, error }
}

// ── useAluno (single) ─────────────────────────────────────────
export function useAluno(id: string | undefined) {
  const [aluno,   setAluno]   = useState<Aluno | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.get<Aluno>(`/alunos/${id}`)
      .then(setAluno)
      .finally(() => setLoading(false))
  }, [id])

  return { aluno, loading }
}

// ── useNotas ──────────────────────────────────────────────────
export function useNotas(turmaId: string | undefined, alunoId: string | undefined) {
  const [notas,   setNotas]   = useState<NotaBimestral | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!turmaId || !alunoId) return
    api.get<NotaBimestral>(`/notas/turma/${turmaId}/aluno/${alunoId}`)
      .then(setNotas)
      .finally(() => setLoading(false))
  }, [turmaId, alunoId])

  return { notas, setNotas, loading }
}

// ── useBoletim ────────────────────────────────────────────────
export function useBoletim(alunoId: string | undefined) {
  const [notas,   setNotas]   = useState<NotaBimestral[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!alunoId) return
    api.get<NotaBimestral[]>(`/notas/aluno/${alunoId}`)
      .then(setNotas)
      .finally(() => setLoading(false))
  }, [alunoId])

  return { notas, loading }
}
