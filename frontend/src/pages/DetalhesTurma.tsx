import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { ArrowLeft, Users, TrendingUp } from 'lucide-react'
import { api } from '../lib/api'
import { corNota } from '../lib/grades'

interface NotaBimestral {
  aluno_id: string; bimestre1: number|null; bimestre2: number|null
  bimestre3: number|null; bimestre4: number|null
}

interface Aluno { id: string; nome: string; matricula: string }

interface Turma {
  id: string; nome: string; disciplina: string; serie: string; periodo: string
  sala: string; cor: string; qtdAlunos: number; media: number
  alunos: Aluno[]
}

function calcularMedia(nota: NotaBimestral) {
  const vals = [nota.bimestre1, nota.bimestre2, nota.bimestre3, nota.bimestre4].filter(v => v !== null) as number[]
  if (!vals.length) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

function DetalhesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-40" />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-4 h-4 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><Skeleton className="h-4 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-9 w-16" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><Skeleton className="h-4 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-9 w-16" /></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><Skeleton className="h-6 w-36" /></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DetalhesTurma() {
  const navigate = useNavigate()
  const { turmaId } = useParams()
  const [turma, setTurma]   = useState<Turma | null>(null)
  const [notas, setNotas]   = useState<Record<string, NotaBimestral>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Turma>(`/turmas/${turmaId}`),
      api.get<NotaBimestral[]>(`/notas/turma/${turmaId}`),
    ]).then(([t, ns]) => {
      setTurma(t)
      const idx: Record<string, NotaBimestral> = {}
      for (const n of ns) idx[n.aluno_id] = n
      setNotas(idx)
    }).finally(() => setLoading(false))
  }, [turmaId])

  if (loading) return <DetalhesSkeleton />

  if (!turma) return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate('/turmas')}>
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>
      <p className="text-center text-gray-500 py-12">Turma não encontrada</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate('/turmas')}>
        <ArrowLeft className="w-4 h-4" /> Voltar para Turmas
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${turma.cor || 'bg-blue-500'}`} />
            <div className="flex-1">
              <CardTitle className="text-2xl">{turma.nome}</CardTitle>
              <p className="text-gray-500 mt-1">{turma.disciplina} {turma.sala ? `• Sala ${turma.sala}` : ''}</p>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-1">{turma.periodo}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" /> Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{turma.qtdAlunos}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Média da Turma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${corNota(turma.media)}`}>
              {turma.media.toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Alunos e Notas</CardTitle></CardHeader>
        <CardContent>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {['Aluno','Matrícula','1º Bim','2º Bim','3º Bim','4º Bim','Média'].map(h => (
                    <th key={h} className={`py-3 px-4 font-medium text-gray-700 ${h === 'Aluno' || h === 'Matrícula' ? 'text-left' : 'text-center'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {turma.alunos.map(aluno => {
                  const n = notas[aluno.id]
                  const media = n ? calcularMedia(n) : null
                  const fmt = (v: number|null|undefined) => (v != null) ? v.toFixed(1) : '-'
                  return (
                    <tr key={aluno.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{aluno.nome}</td>
                      <td className="py-3 px-4 text-gray-600">{aluno.matricula}</td>
                      {[n?.bimestre1, n?.bimestre2, n?.bimestre3, n?.bimestre4].map((v, i) => (
                        <td key={i} className="text-center py-3 px-4">
                          <span className={`font-semibold ${corNota(v ?? null)}`}>{fmt(v)}</span>
                        </td>
                      ))}
                      <td className="text-center py-3 px-4">
                        <span className={`font-bold text-lg ${corNota(media)}`}>{fmt(media)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {turma.alunos.length === 0 && (
              <div className="py-12 text-center text-gray-500">Nenhum aluno matriculado nesta turma</div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            {turma.alunos.map(aluno => {
              const n = notas[aluno.id]
              const media = n ? calcularMedia(n) : null
              const fmt = (v: number|null|undefined) => (v != null) ? v.toFixed(1) : '-'
              return (
                <div key={aluno.id} className="border rounded-lg p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div>
                      <p className="font-semibold">{aluno.nome}</p>
                      <p className="text-sm text-gray-500">Mat: {aluno.matricula}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Média</p>
                      <p className={`font-bold text-2xl ${corNota(media)}`}>{fmt(media)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[n?.bimestre1, n?.bimestre2, n?.bimestre3, n?.bimestre4].map((v, i) => (
                      <div key={i}>
                        <p className="text-xs text-gray-500 mb-1">{i+1}º Bim</p>
                        <p className={`font-semibold text-lg ${corNota(v ?? null)}`}>{fmt(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
