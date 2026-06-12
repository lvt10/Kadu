import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../lib/api'

interface Turma { id: string; nome: string; serie: string }
interface Aluno { id: string; nome: string; matricula: string; pcd: boolean }

export default function NotasLancamento() {
  const navigate = useNavigate()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  
  const [turmaId, setTurmaId] = useState('')
  const [materia, setMateria] = useState('Matemática')
  const [matrizNotas, setMatrizNotas] = useState<Record<string, { b1: string; b2: string; b3: string; b4: string }>>({})

  useEffect(() => { api.get<Turma[]>('/turmas').then(res => setTurmas(res.data)) }, [])

  // Atualiza a lista de alunos e busca as notas correspondentes
  useEffect(() => {
    if (turmaId) {
      api.get<Aluno[]>(`/alunos?turmaId=${turmaId}`).then(async (resAlunos) => {
        setAlunos(resAlunos.data)
        
        // Inicializa a matriz de notas para cada aluno
        const novaMatriz: any = {}
        for (const aluno of resAlunos.data) {
          novaMatriz[aluno.id] = { b1: '', b2: '', b3: '', b4: '' }
          try {
            const resNotas = await api.get(`/notas/aluno/${aluno.id}`)
            const notaMateria = resNotas.data.find((n: any) => n.materia === materia)
            if (notaMateria) {
              novaMatriz[aluno.id] = {
                b1: notaMateria.bimestre1?.toString() || '',
                b2: notaMateria.bimestre2?.toString() || '',
                b3: notaMateria.bimestre3?.toString() || '',
                b4: notaMateria.bimestre4?.toString() || '',
              }
            }
          } catch (e) {}
        }
        setMatrizNotas(novaMatriz)
      })
    }
  }, [turmaId, materia])

  const handleNotaChange = (alunoId: string, bimestre: 'b1' | 'b2' | 'b3' | 'b4', valor: string) => {
    setMatrizNotas(prev => ({
      ...prev,
      [alunoId]: { ...prev[alunoId], [bimestre]: valor }
    }))
  }

  const handleSalvarLote = async () => {
    try {
      await api.post('/notas/lote', { turmaId, materia, notas: matrizNotas })
      toast.success('Todas as notas da turma foram salvas com sucesso!')
    } catch (e) {
      toast.error('Erro ao salvar notas em lote.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-3xl font-bold tracking-tight">Lançamento Matricial de Notas</h1>
      </div>

      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Selecione a Turma</Label>
            <select className="w-full p-2 border rounded-md bg-background" value={turmaId} onChange={e => setTurmaId(e.target.value)}>
              <option value="">Selecione...</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.serie})</option>)}
            </select>
          </div>
          <div>
            <Label>Matéria</Label>
            <Input value={materia} onChange={e => setMateria(e.target.value)} placeholder="Ex: Matemática, História..." />
          </div>
        </CardContent>
      </Card>

      {turmaId && alunos.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Grade de Notas - {materia}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-muted text-sm">
                <thead>
                  <tr className="bg-secondary">
                    <th className="border p-2 text-left">Aluno</th>
                    <th className="border p-2 w-24 text-center">1º Bimestre</th>
                    <th className="border p-2 w-24 text-center">2º Bimestre</th>
                    <th className="border p-2 w-24 text-center">3º Bimestre</th>
                    <th className="border p-2 w-24 text-center">4º Bimestre</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map(aluno => (
                    <tr key={aluno.id} className="hover:bg-accent/50">
                      <td className="border p-2 font-medium">
                        {aluno.nome}
                        {aluno.pcd && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded ml-2">PCD</span>
                        )}
                      </td>
                      {['b1', 'b2', 'b3', 'b4'].map(b => (
                        <td key={b} className="border p-1">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            className="text-center h-8"
                            value={matrizNotas[aluno.id]?.[b as 'b1'|'b2'|'b3'|'b4'] || ''}
                            onChange={e => handleNotaChange(aluno.id, b as any, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={handleSalvarLote} className="mt-4 w-full"><Save className="h-4 w-4 mr-2" /> Salvar Notas da Turma</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
