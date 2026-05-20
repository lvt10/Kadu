import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button, buttonVariants } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction,
} from '../components/ui/alert-dialog'
import { Plus, Users, TrendingUp, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../lib/api'
import { corNota } from '../lib/grades'

interface Turma {
  id: string; nome: string; disciplina: string; serie: string
  periodo: string; ano: number; sala: string; cor: string
  qtdAlunos: number; media: number
}

function TurmasSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Turmas() {
  const navigate = useNavigate()
  const [turmas,  setTurmas]  = useState<Turma[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [turmaParaDeletar, setTurmaParaDeletar] = useState<Turma | null>(null)
  const [deletando, setDeletando] = useState(false)

  useEffect(() => {
    api.get<Turma[]>('/turmas')
      .then(setTurmas)
      .catch(() => setErro('Erro ao carregar turmas. Tente novamente.'))
      .finally(() => setCarregando(false))
  }, [])

  const iniciarDelecao = (e: React.MouseEvent, turma: Turma) => {
    e.stopPropagation()
    setTurmaParaDeletar(turma)
  }

  const confirmarDelecao = async () => {
    if (!turmaParaDeletar) return
    setDeletando(true)
    try {
      await api.delete(`/turmas/${turmaParaDeletar.id}`)
      setTurmas(prev => prev.filter(t => t.id !== turmaParaDeletar.id))
      toast.success('Turma excluída com sucesso!')
    } catch {
      toast.error('Erro ao excluir turma. Tente novamente.')
    } finally {
      setDeletando(false)
      setTurmaParaDeletar(null)
    }
  }

  if (carregando) return <TurmasSkeleton />

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
                  <Button variant="ghost" size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Excluir turma"
                    onClick={e => iniciarDelecao(e, turma)}>
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
                    <p className={`text-2xl font-bold ${corNota(turma.media)}`}>{turma.media.toFixed(1)}</p>
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

      <AlertDialog
        open={!!turmaParaDeletar}
        onOpenChange={open => { if (!open) setTurmaParaDeletar(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir turma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma <strong>"{turmaParaDeletar?.nome}"</strong>?
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
