import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Search, Plus, FileText } from 'lucide-react'
import { api } from '../lib/api'

interface Turma { id: string; nome: string }
interface Aluno  { id: string; nome: string; matricula: string; email: string; serie: string; turmaId: string; mediaNotas: number }

export default function Alunos() {
  const navigate = useNavigate()
  const [alunos,  setAlunos]  = useState<Aluno[]>([])
  const [turmas,  setTurmas]  = useState<Turma[]>([])
  const [busca,   setBusca]   = useState('')
  const [turmaFiltro, setTurmaFiltro] = useState('todas')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get<Aluno[]>('/alunos'), api.get<Turma[]>('/turmas')])
      .then(([a, t]) => { setAlunos(a); setTurmas(t) })
      .finally(() => setLoading(false))
  }, [])

  const filtrados = alunos.filter(a => {
    const q = busca.toLowerCase()
    const correspondeBusca = a.nome.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.matricula.includes(q)
    const correspondeTurma = turmaFiltro === 'todas' || a.turmaId === turmaFiltro
    return correspondeBusca && correspondeTurma
  })

  const iniciais = (nome: string) => nome.split(' ').map(n => n[0]).join('').toUpperCase()

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Alunos</h2>
          <p className="text-gray-500 mt-1">Gerencie e visualize informações dos alunos</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/alunos/cadastrar')}>
          <Plus className="w-4 h-4" /> Adicionar Aluno
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar por nome, e-mail ou matrícula..."
                value={busca} onChange={e => setBusca(e.target.value)} className="pl-10" />
            </div>
            <Select value={turmaFiltro} onValueChange={setTurmaFiltro}>
              <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Filtrar por turma" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Turmas</SelectItem>
                {turmas.map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map(aluno => {
          const turma = turmas.find(t => t.id === aluno.turmaId)
          return (
            <Card key={aluno.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {iniciais(aluno.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{aluno.nome}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Matrícula: {aluno.matricula}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Série</span>
                    <Badge variant="secondary">{aluno.serie || '—'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Turma</span>
                    <span className="text-sm font-medium text-gray-900">{turma?.nome || '—'}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <Button variant="outline" size="sm" className="w-full gap-2"
                      onClick={() => navigate(`/alunos/${aluno.id}/boletim`)}>
                      <FileText className="w-4 h-4" /> Ver Boletim
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtrados.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum aluno encontrado com os critérios informados</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
