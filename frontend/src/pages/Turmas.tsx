import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Plus, Users, TrendingUp } from 'lucide-react'
import { api } from '../lib/api'

interface Turma {
  id: string; nome: string; disciplina: string; serie: string
  periodo: string; ano: number; sala: string; cor: string
  qtdAlunos: number; media: number
}

export default function Turmas() {
  const navigate = useNavigate()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get<Turma[]>('/turmas')
      .then(setTurmas)
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <div className="flex justify-center py-20 text-gray-400">Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Minhas Turmas</h2>
          <p className="text-gray-500 mt-1">Gerencie suas turmas e visualize o desempenho</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/turmas/cadastrar')}>
          <Plus className="w-4 h-4" /> Adicionar Turma
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {turmas.map(turma => (
          <Card key={turma.id} className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/turmas/${turma.id}`)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${turma.cor || 'bg-blue-500'}`} />
                  <div>
                    <CardTitle className="text-xl">{turma.nome}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{turma.disciplina}</p>
                  </div>
                </div>
                <Badge variant="secondary">{turma.periodo}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-2xl font-bold">{turma.qtdAlunos}</p>
                    <p className="text-xs text-gray-500">Alunos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-2xl font-bold">{turma.media.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Média</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {turmas.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Visão Geral de Desempenho</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Turma</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Período</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Alunos</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Média</th>
                  </tr>
                </thead>
                <tbody>
                  {turmas.map(turma => (
                    <tr key={turma.id} className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/turmas/${turma.id}`)}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${turma.cor || 'bg-blue-500'}`} />
                          <span className="font-medium">{turma.nome}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{turma.periodo}</td>
                      <td className="py-3 px-4 text-gray-600">{turma.qtdAlunos}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${turma.media >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
                          {turma.media.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {turmas.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-gray-500">Nenhuma turma cadastrada. Clique em "Adicionar Turma" para começar.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
