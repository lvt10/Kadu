import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button, buttonVariants } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction,
} from '../components/ui/alert-dialog'
import { Search, Plus, FileText, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../lib/api'

interface Turma { id: string; nome: string }
interface Aluno  { id: string; nome: string; matricula: string; email: string; serie: string; turmaId: string; mediaNotas: number }

function AlunosSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-full md:w-[200px]" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Alunos() {
  const navigate = useNavigate()
  const [alunos,  setAlunos]  = useState<Aluno[]>([])
  const [turmas,  setTurmas]  = useState<Turma[]>([])
  const [busca,   setBusca]   = useState('')
  const [turmaFiltro, setTurmaFiltro] = useState('todas')
  const [loading, setLoading] = useState(true)
  const [erro,    setErro]    = useState('')
  const [alunoParaDeletar, setAlunoParaDeletar] = useState<Aluno | null>(null)
  const [deletando, setDeletando] = useState(false)

  useEffect(() => {
    Promise.all([api.get<Aluno[]>('/alunos'), api.get<Turma[]>('/turmas')])
      .then(([a, t]) => { setAlunos(a); setTurmas(t) })
      .catch(() => setErro('Erro ao carregar alunos. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [])

  const iniciarDelecao = (e: React.MouseEvent, aluno: Aluno) => {
    e.stopPropagation()
    setAlunoParaDeletar(aluno)
  }

  const confirmarDelecao = async () => {
    if (!alunoParaDeletar) return
    setDeletando(true)
    try {
      await api.delete(`/alunos/${alunoParaDeletar.id}`)
      setAlunos(prev => prev.filter(a => a.id !== alunoParaDeletar.id))
      toast.success('Aluno excluído com sucesso!')
    } catch {
      toast.error('Erro ao excluir aluno. Tente novamente.')
    } finally {
      setDeletando(false)
      setAlunoParaDeletar(null)
    }
  }

  const filtrados = alunos.filter(a => {
    const q = busca.toLowerCase()
    const correspondeBusca = a.nome.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.matricula.includes(q)
    const correspondeTurma = turmaFiltro === 'todas' || a.turmaId === turmaFiltro
    return correspondeBusca && correspondeTurma
  })

  const iniciais = (nome: string) => nome.split(' ').map(n => n[0]).join('').toUpperCase()

  if (loading) return <AlunosSkeleton />

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
                  <Button variant="ghost" size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                    title="Excluir aluno"
                    onClick={e => iniciarDelecao(e, aluno)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
            <p className="text-gray-500">
              {busca || turmaFiltro !== 'todas'
                ? 'Nenhum aluno encontrado para os filtros aplicados.'
                : 'Nenhum aluno cadastrado.'}
            </p>
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={!!alunoParaDeletar}
        onOpenChange={open => { if (!open) setAlunoParaDeletar(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir aluno</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o aluno <strong>"{alunoParaDeletar?.nome}"</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={confirmarDelecao}
              disabled={deletando}>
              {deletando ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
