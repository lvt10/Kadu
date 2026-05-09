import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Plus, Users, TrendingUp, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../lib/api'

interface Turma {
  id: string; nome: string; disciplina: string; serie: string
  periodo: string; ano: number; sala: string; cor: string
  qtdAlunos: number; media: number
}

export default function Turmas() {
  const navigate = useNavigate()
  const [turmas,  setTurmas]  = useState<Turma[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api.get<Turma[]>('/turmas')
      .then(setTurmas)
      .catch(() => setErro('Erro ao carregar turmas. Tente novamente.'))
      .finally(() => setCarregando(false))
  }, [])

  const handleDeletar = async (e: React.MouseEvent, turma: Turma) => {
    e.stopPropagation()
    if (!window.confirm(`Tem certeza que deseja excluir a turma "${turma.nome}"? Esta ação não pode ser desfeita.`)) return
    try {
      await api.delete(`/turmas/${turma.id}`)
      setTurmas(prev => prev.filter(t => t.id !== turma.id))
      toast.success('Turma excluída com sucesso!')
    } catch {
      toast.error('Erro ao excluir turma. Tente novamente.')
    }
  }

  if (carregando) return <div className="flex justify-center py-20 text-gray-400">Carregando...</div>

  if (erro) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4">{erro}</p>
      <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
    </div>
  )

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
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{turma.periodo}</Badge>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={e => handleDeletar(e, turma)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
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
