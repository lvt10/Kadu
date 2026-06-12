import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import { api } from '../lib/api'
import { toast } from 'sonner'

interface Turma { id: string; nome: string; serie: string }
interface Vinculo { id: string; turmaId: string }

export default function CadastroAluno() {
  const navigate  = useNavigate()
  const [turmas,      setTurmas]      = useState<Turma[]>([])
  const [carregando,  setCarregando]  = useState(false)
  const [form, setForm] = useState({ nome: '', matricula: '', pcd: false })
  const [vinculos, setVinculos] = useState<Vinculo[]>([{ id: crypto.randomUUID(), turmaId: '' }])

  useEffect(() => { api.get<Turma[]>('/turmas').then(setTurmas) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    try {
      const turmaIds = vinculos.map(v => v.turmaId).filter(Boolean)
      await api.post('/alunos', { 
        nome: form.nome, 
        matricula: form.matricula, 
        pcd: form.pcd,
        turmaIds 
      })
      toast.success('Aluno cadastrado com sucesso!')
      navigate('/alunos')
    } catch (err: any) {
      toast.error('Erro ao cadastrar aluno')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Aluno</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Informações Pessoais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="matricula">Matrícula</Label>
              <Input id="matricula" required value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} />
            </div>
            
            <div className="flex items-center gap-2 py-2 border-t border-b">
              <input 
                type="checkbox" 
                id="pcd" 
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={form.pcd} 
                onChange={e => setForm({...form, pcd: e.target.checked})} 
              />
              <Label htmlFor="pcd" className="font-semibold text-blue-600 cursor-pointer">Aluno PCD (Pessoa com Deficiência)</Label>
            </div>

            <div>
              <Label>Vincular à Turma</Label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={vinculos[0].turmaId}
                onChange={e => setVinculos([{ ...vinculos[0], turmaId: e.target.value }])}
              >
                <option value="">Selecione uma turma...</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.serie})</option>)}
              </select>
            </div>
            <Button type="submit" disabled={carregando} className="w-full mt-4"><Save className="h-4 w-4 mr-2" /> Salvar Aluno</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
