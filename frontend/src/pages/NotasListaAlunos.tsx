import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { ArrowLeft, User, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { api } from '../lib/api'

interface Aluno { id: string; nome: string; matricula: string; mediaNotas: number }
interface Turma  { id: string; nome: string; serie: string; media: number; alunos: Aluno[] }

export default function NotasListaAlunos() {
  const navigate = useNavigate()
  const { turmaId } = useParams()
  const [turma,  setTurma]  = useState<Turma | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Turma>(`/turmas/${turmaId}`).then(setTurma).finally(() => setLoading(false))
  }, [turmaId])

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Carregando...</div>

  if (!turma) return (
    <div className="space-y-6">
      <Button variant="ghost" size="icon" onClick={() => navigate('/notas')}><ArrowLeft className="w-5 h-5" /></Button>
      <p className="text-center text-gray-500">Turma não encontrada</p>
    </div>
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
            <div className={`text-3xl font-bold ${turma.media >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
              {turma.media.toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Alunos da Turma</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {turma.alunos.map(aluno => {
              const media = aluno.mediaNotas  // escala 0-100 → 0-10
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
                      <div className={`text-2xl font-bold ${media >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
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
          {turma.alunos.length === 0 && (
            <div className="py-12 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum aluno matriculado nesta turma</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
