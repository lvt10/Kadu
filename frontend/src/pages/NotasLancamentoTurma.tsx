import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Skeleton } from '../components/ui/skeleton'
import { ArrowLeft, Save, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../lib/api'
import { corNota, parseNota, mediaRow } from '../lib/grades'

interface Aluno { id: string; nome: string; matricula: string }
interface Turma  { id: string; nome: string; disciplina: string; alunos: Aluno[] }
interface NotaRow {
  alunoId: string
  bimestre1: string
  bimestre2: string
  bimestre3: string
  bimestre4: string
}

const mediaRow_ = (row: NotaRow) =>
  mediaRow([row.bimestre1, row.bimestre2, row.bimestre3, row.bimestre4])

export default function NotasLancamentoTurma() {
  const navigate = useNavigate()
  const { turmaId } = useParams()
  const [turma,    setTurma]    = useState<Turma | null>(null)
  const [rows,     setRows]     = useState<NotaRow[]>([])
  const [loading,  setLoading]  = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<Turma>(`/turmas/${turmaId}`),
      api.get<{ aluno_id: string; bimestre1: number|null; bimestre2: number|null; bimestre3: number|null; bimestre4: number|null }[]>(`/notas/turma/${turmaId}`),
    ]).then(([t, notas]) => {
      setTurma(t)
      setRows(t.alunos.map(a => {
        const n = notas.find(x => x.aluno_id === a.id)
        return {
          alunoId:   a.id,
          bimestre1: n?.bimestre1 != null ? String(n.bimestre1) : '',
          bimestre2: n?.bimestre2 != null ? String(n.bimestre2) : '',
          bimestre3: n?.bimestre3 != null ? String(n.bimestre3) : '',
          bimestre4: n?.bimestre4 != null ? String(n.bimestre4) : '',
        }
      }))
    }).finally(() => setLoading(false))
  }, [turmaId])

  const setCell = (alunoId: string, campo: keyof Omit<NotaRow, 'alunoId'>, val: string) => {
    setRows(prev => prev.map(r => r.alunoId === alunoId ? { ...r, [campo]: val } : r))
  }

  const handleSalvar = async () => {
    setSalvando(true)
    try {
      const notas = rows.map(r => ({
        alunoId:   r.alunoId,
        bimestre1: parseNota(r.bimestre1),
        bimestre2: parseNota(r.bimestre2),
        bimestre3: parseNota(r.bimestre3),
        bimestre4: parseNota(r.bimestre4),
      }))
      await api.post(`/notas/turma/${turmaId}/batch`, { notas })
      toast.success('Notas salvas com sucesso!')
    } catch {
      toast.error('Erro ao salvar notas. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (loading) return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-96 w-full" />
    </div>
  )

  if (!turma) return (
    <div className="space-y-6">
      <Button variant="ghost" size="icon" onClick={() => navigate('/notas')}><ArrowLeft className="w-5 h-5" /></Button>
      <p className="text-center text-gray-500">Turma não encontrada</p>
    </div>
  )

  const bimestres: (keyof Omit<NotaRow, 'alunoId'>)[] = ['bimestre1', 'bimestre2', 'bimestre3', 'bimestre4']
  const labels = ['1º Bim', '2º Bim', '3º Bim', '4º Bim']

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/notas/turma/${turmaId}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900">Lançamento em Massa</h2>
          <p className="text-gray-500 mt-1">{turma.nome} — {turma.disciplina}</p>
        </div>
        <Button onClick={handleSalvar} disabled={salvando} className="gap-2">
          <Save className="w-4 h-4" />
          {salvando ? 'Salvando...' : 'Salvar Todas as Notas'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Notas por Aluno — {turma.alunos.length} alunos
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 min-w-[200px]">Aluno</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm text-gray-500 min-w-[80px]">Matrícula</th>
                {labels.map(l => (
                  <th key={l} className="text-center py-3 px-4 font-semibold text-gray-700 min-w-[100px]">{l}</th>
                ))}
                <th className="text-center py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Média</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const aluno = turma.alunos.find(a => a.id === row.alunoId)!
                const m = mediaRow_(row)
                return (
                  <tr key={row.alunoId} className={`border-b ${idx % 2 === 0 ? '' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <td className="py-2 px-4 font-medium text-gray-900">{aluno.nome}</td>
                    <td className="py-2 px-4 text-sm text-gray-500">{aluno.matricula}</td>
                    {bimestres.map(b => (
                      <td key={b} className="py-2 px-2 text-center">
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          placeholder="—"
                          value={row[b]}
                          onChange={e => setCell(row.alunoId, b, e.target.value)}
                          className="w-20 text-center mx-auto h-8 text-sm"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-4 text-center">
                      <span className={`font-bold text-lg ${corNota(m)}`}>
                        {m !== null ? m.toFixed(1) : '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {turma.alunos.length === 0 && (
            <p className="py-12 text-center text-gray-500">Nenhum aluno matriculado nesta turma.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSalvar} disabled={salvando} size="lg" className="gap-2">
          <Save className="w-4 h-4" />
          {salvando ? 'Salvando...' : 'Salvar Todas as Notas'}
        </Button>
      </div>
    </div>
  )
}
