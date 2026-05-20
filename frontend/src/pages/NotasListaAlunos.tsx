import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Skeleton } from '../components/ui/skeleton'
import { ArrowLeft, User, ChevronRight, TrendingUp, TrendingDown, Search } from 'lucide-react'
import { api } from '../lib/api'
import { corNota } from '../lib/grades'

interface Aluno { id: string; nome: string; matricula: string; mediaNotas: number }
interface Turma  { id: string; nome: string; serie: string; media: number; alunos: Aluno[] }

function ListaAlunosSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><Skeleton className="h-4 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-9 w-12" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><Skeleton className="h-4 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-9 w-16" /></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><Skeleton className="h-6 w-36" /></CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
        </CardContent>
      </Card>
    </div>
  )
}

export default function NotasListaAlunos() {
  const navigate = useNavigate()
  const { turmaId } = useParams()
  const [turma,  setTurma]  = useState<Turma | null>(null)
  const [busca,  setBusca]  = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Turma>(`/turmas/${turmaId}`).then(setTurma).finally(() => setLoading(false))
  }, [turmaId])

  if (loading) return <ListaAlunosSkeleton />

  if (!turma) return (
    <div className="space-y-6">
      <Button variant="ghost" size="icon" onClick={() => navigate('/notas')}><ArrowLeft className="w-5 h-5" /></Button>
      <p className="text-center text-gray-500">Turma não encontrada</p>
    </div>
  )

  const filtrados = turma.alunos.filter(a =>
    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
    a.matricula.includes(busca)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/notas')}><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{turma.nome}</h2>
          <p className="text-gray-500 mt-1">Selecione um aluno para lançar as notas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{turma.alunos.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Média da Turma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${corNota(turma.media)}`}>
              {turma.media.toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Alunos da Turma</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou matrícula..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtrados.map(aluno => {
              const media = aluno.mediaNotas
              return (
                <div key={aluno.id}
                  onClick={() => navigate(`/notas/turma/${turmaId}/aluno/${aluno.id}`)}
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{aluno.nome}</h3>
                      <p className="text-sm text-gray-500">Matrícula: {aluno.matricula}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Média Atual</div>
                      <div className={`text-2xl font-bold ${corNota(media)}`}>
                        {media.toFixed(1)}
                      </div>
                    </div>
                    {media >= 7
                      ? <TrendingUp className="w-6 h-6 text-green-600" />
                      : <TrendingDown className="w-6 h-6 text-orange-600" />}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )
            })}
          </div>
          {filtrados.length === 0 && (
            <div className="py-12 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {busca ? 'Nenhum aluno encontrado para essa busca.' : 'Nenhum aluno matriculado nesta turma.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
