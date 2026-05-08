import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { BookOpen, Users, ChevronRight } from 'lucide-react'
import { api } from '../lib/api'

interface Turma { id: string; nome: string; serie: string; qtdAlunos: number; media: number }

export default function NotasListaTurmas() {
  const navigate = useNavigate()
  const [turmas,  setTurmas]  = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Turma[]>('/turmas').then(setTurmas).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Carregando...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Lançamento de Notas</h2>
        <p className="text-gray-500 mt-1">Selecione uma turma para lançar as notas dos alunos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turmas.map(turma => (
          <Card key={turma.id} className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/notas/turma/${turma.id}`)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> {turma.nome}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Série:</span>
                  <span className="font-medium">{turma.serie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1"><Users className="w-4 h-4" /> Alunos:</span>
                  <span className="font-medium">{turma.qtdAlunos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Média da Turma:</span>
                  <span className={`font-bold ${turma.media >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
                    {turma.media.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t flex items-center justify-end text-blue-600 font-medium text-sm">
                Selecionar turma <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {turmas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma turma cadastrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
