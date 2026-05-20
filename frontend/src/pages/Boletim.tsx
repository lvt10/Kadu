import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { ArrowLeft, Printer } from 'lucide-react'
import { api } from '../lib/api'
import { corNota, statusNota, varianteBadge } from '../lib/grades'

interface NotaBimestral {
  id: number; materia: string; turmaNome: string
  bimestre1: number|null; bimestre2: number|null; bimestre3: number|null; bimestre4: number|null
}
interface Aluno { id: string; nome: string; matricula: string; serie: string }

function calcularMedia(n: NotaBimestral) {
  const vals = [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null) as number[]
  if (!vals.length) return null
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
}

function BoletimSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-36" />
      </div>
      <Card>
        <CardHeader><div className="text-center space-y-2"><Skeleton className="h-9 w-48 mx-auto" /><Skeleton className="h-4 w-32 mx-auto" /></div></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1"><Skeleton className="h-3 w-24" /><Skeleton className="h-5 w-40" /></div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Boletim() {
  const navigate    = useNavigate()
  const { alunoId } = useParams()
  const [aluno,   setAluno]   = useState<Aluno | null>(null)
  const [notas,   setNotas]   = useState<NotaBimestral[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Aluno>(`/alunos/${alunoId}`),
      api.get<NotaBimestral[]>(`/notas/aluno/${alunoId}`),
    ]).then(([a, n]) => { setAluno(a); setNotas(n) }).finally(() => setLoading(false))
  }, [alunoId])

  if (loading) return <BoletimSkeleton />

  if (!aluno) return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate('/alunos')}>
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>
      <p className="text-center text-gray-500 py-12">Aluno não encontrado</p>
    </div>
  )

  const professorNome = localStorage.getItem('professorNome') || 'Professor'
  const mediasValidas = notas.map(calcularMedia).filter(m => m !== null) as number[]
  const mediaGeral    = mediasValidas.length
    ? parseFloat((mediasValidas.reduce((a, b) => a + b, 0) / mediasValidas.length).toFixed(1))
    : 0

  return (
    <div className="space-y-6">
      <style>{`@media print { body * { visibility:hidden } .print-content, .print-content * { visibility:visible } .print-content { position:absolute; left:0; top:0; width:100% } }`}</style>

      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" className="gap-2" onClick={() => navigate('/alunos')}>
          <ArrowLeft className="w-4 h-4" /> Voltar para Alunos
        </Button>
        <Button className="gap-2" onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Imprimir Boletim
        </Button>
      </div>

      <div className="print-content space-y-6">
        <Card>
          <CardHeader>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Boletim Escolar</h1>
              <p className="text-gray-500">Ano Letivo {new Date().getFullYear()}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t">
              <div><p className="text-sm text-gray-500">Nome do Aluno</p><p className="font-semibold">{aluno.nome}</p></div>
              <div><p className="text-sm text-gray-500">Matrícula</p><p className="font-semibold">{aluno.matricula}</p></div>
              <div><p className="text-sm text-gray-500">Série</p><p className="font-semibold">{aluno.serie || '—'}</p></div>
              <div><p className="text-sm text-gray-500">Professor Responsável</p><p className="font-semibold">{professorNome}</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notas por Bimestre</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    {['Matéria','1º Bimestre','2º Bimestre','3º Bimestre','4º Bimestre','Média','Status'].map(h => (
                      <th key={h} className={`py-3 px-4 font-semibold text-gray-700 ${h === 'Matéria' ? 'text-left' : 'text-center'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notas.map(nota => {
                    const media   = calcularMedia(nota)
                    const stat    = statusNota(media)
                    const fmt     = (v: number|null) => v !== null ? v.toFixed(1) : '—'
                    return (
                      <tr key={nota.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{nota.materia}</td>
                        {[nota.bimestre1, nota.bimestre2, nota.bimestre3, nota.bimestre4].map((v, i) => (
                          <td key={i} className="text-center py-3 px-4">
                            <span className={`font-semibold ${corNota(v)}`}>{fmt(v)}</span>
                          </td>
                        ))}
                        <td className="text-center py-3 px-4">
                          <span className={`font-bold text-lg ${corNota(media)}`}>{fmt(media)}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge variant={varianteBadge(stat)}>{stat}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 bg-gray-50">
                    <td className="py-4 px-4 font-bold" colSpan={5}>Média Geral</td>
                    <td className="text-center py-4 px-4">
                      <span className={`font-bold text-xl ${corNota(mediaGeral)}`}>{mediaGeral.toFixed(1)}</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <Badge variant={varianteBadge(statusNota(mediaGeral))} className="text-base px-4 py-1">
                        {statusNota(mediaGeral)}
                      </Badge>
                    </td>
                  </tr>
                </tfoot>
              </table>
              {notas.length === 0 && (
                <p className="py-12 text-center text-gray-500">Nenhuma nota lançada para este aluno</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
