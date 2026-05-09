import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { ArrowLeft, Save, User, BookOpen, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../lib/api'

interface NotasBimestre { bimestre1: string; bimestre2: string; bimestre3: string; bimestre4: string }
interface Turma  { id: string; nome: string; serie: string }
interface Aluno  { id: string; nome: string; matricula: string }

function corNota(nota: number) {
  if (nota >= 9) return 'text-green-600'
  if (nota >= 7) return 'text-blue-600'
  if (nota >= 5) return 'text-yellow-600'
  return 'text-red-600'
}

export default function NotasLancamento() {
  const navigate = useNavigate()
  const { turmaId, alunoId } = useParams()
  const [turma,  setTurma]  = useState<Turma | null>(null)
  const [aluno,  setAluno]  = useState<Aluno | null>(null)
  const [notas,  setNotas]  = useState<NotasBimestre>({ bimestre1: '', bimestre2: '', bimestre3: '', bimestre4: '' })
  const [bimSelecionado, setBimSelecionado] = useState('1')
  const [carregando, setCarregando] = useState(false)
  const [loading,    setLoading]    = useState(true)
  const [erro,       setErro]       = useState('')

  useEffect(() => {
    Promise.all([
      api.get<Turma>(`/turmas/${turmaId}`),
      api.get<Aluno>(`/alunos/${alunoId}`),
      api.get<{ bimestre1: number|null; bimestre2: number|null; bimestre3: number|null; bimestre4: number|null }>(
        `/notas/turma/${turmaId}/aluno/${alunoId}`
      ),
    ]).then(([t, a, n]) => {
      setTurma(t)
      setAluno(a)
      setNotas({
        bimestre1: n.bimestre1 != null ? String(n.bimestre1) : '',
        bimestre2: n.bimestre2 != null ? String(n.bimestre2) : '',
        bimestre3: n.bimestre3 != null ? String(n.bimestre3) : '',
        bimestre4: n.bimestre4 != null ? String(n.bimestre4) : '',
      })
    }).catch(() => setErro('Erro ao carregar dados. Tente novamente.'))
    .finally(() => setLoading(false))
  }, [turmaId, alunoId])

  const calcularMedia = () => {
    const vals = Object.values(notas).map(v => parseFloat(v)).filter(v => !isNaN(v) && v >= 0)
    if (!vals.length) return 0
    return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    try {
      await api.post('/notas', {
        alunoId,
        turmaId,
        bimestre1: notas.bimestre1 !== '' ? parseFloat(notas.bimestre1) : null,
        bimestre2: notas.bimestre2 !== '' ? parseFloat(notas.bimestre2) : null,
        bimestre3: notas.bimestre3 !== '' ? parseFloat(notas.bimestre3) : null,
        bimestre4: notas.bimestre4 !== '' ? parseFloat(notas.bimestre4) : null,
      })
      toast.success('Notas salvas com sucesso!')
      navigate(`/notas/turma/${turmaId}`)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao salvar notas')
    } finally {
      setCarregando(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Carregando...</div>

  if (erro) return (
    <div className="space-y-6">
      <Button variant="ghost" size="icon" onClick={() => navigate('/notas')}><ArrowLeft className="w-5 h-5" /></Button>
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{erro}</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    </div>
  )

  if (!turma || !aluno) return (
    <div className="space-y-6">
      <Button variant="ghost" size="icon" onClick={() => navigate('/notas')}><ArrowLeft className="w-5 h-5" /></Button>
      <p className="text-center text-gray-500">Dados não encontrados</p>
    </div>
  )

  const bimKey = `bimestre${bimSelecionado}` as keyof NotasBimestre
  const media  = calcularMedia()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/notas/turma/${turmaId}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Lançamento de Notas</h2>
          <p className="text-gray-500 mt-1">{turma.nome} • {aluno.nome}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <User className="w-4 h-4" /> Aluno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-lg">{aluno.nome}</div>
            <div className="text-sm text-gray-500">Matrícula: {aluno.matricula}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Turma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-lg">{turma.nome}</div>
            <div className="text-sm text-gray-500">{turma.serie}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Média Calculada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${corNota(media)}`}>{media}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Selecione o Bimestre</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['1','2','3','4'].map(bim => (
              <button key={bim} type="button" onClick={() => setBimSelecionado(bim)}
                className={`p-4 rounded-lg border-2 font-medium transition-all ${
                  bimSelecionado === bim ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                }`}>
                {bim}º Bimestre
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Lançar Nota — {bimSelecionado}º Bimestre</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nota (0 a 10) *</Label>
                <Input type="number" step="0.1" min="0" max="10"
                  value={notas[bimKey]}
                  onChange={e => setNotas(p => ({ ...p, [bimKey]: e.target.value }))}
                  placeholder="Ex: 8.5" required className="text-lg" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="h-10 flex items-center">
                  {notas[bimKey] !== '' && (() => {
                    const v = parseFloat(notas[bimKey])
                    return (
                      <span className={`font-bold text-xl ${v >= 7 ? 'text-green-600' : v >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {v >= 7 ? '✓ Aprovado' : v >= 5 ? '⚠ Recuperação' : '✗ Reprovado'}
                      </span>
                    )
                  })()}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Resumo de Todos os Bimestres</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['1','2','3','4'].map(bim => {
                  const key = `bimestre${bim}` as keyof NotasBimestre
                  const val = notas[key]
                  return (
                    <div key={bim} className={`p-4 rounded-lg border ${bim === bimSelecionado ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="text-sm text-gray-600 mb-1">{bim}º Bimestre</div>
                      <div className={`text-2xl font-bold ${val ? corNota(parseFloat(val)) : 'text-gray-400'}`}>
                        {val || '—'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 justify-end mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(`/notas/turma/${turmaId}`)}>Cancelar</Button>
          <Button type="submit" disabled={carregando} className="gap-2">
            <Save className="w-4 h-4" /> {carregando ? 'Salvando...' : 'Salvar Notas'}
          </Button>
        </div>
      </form>
    </div>
  )
}
