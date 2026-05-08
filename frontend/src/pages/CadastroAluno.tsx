import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { ArrowLeft, Save, User, Users, Plus, Trash2 } from 'lucide-react'
import { api } from '../lib/api'

interface Turma { id: string; nome: string; serie: string }
interface Vinculo { id: string; turmaId: string }

export default function CadastroAluno() {
  const navigate  = useNavigate()
  const [turmas,      setTurmas]      = useState<Turma[]>([])
  const [carregando,  setCarregando]  = useState(false)
  const [erro,        setErro]        = useState('')
  const [form, setForm] = useState({ nome: '', matricula: '' })
  const [vinculos, setVinculos] = useState<Vinculo[]>([{ id: crypto.randomUUID(), turmaId: '' }])

  useEffect(() => { api.get<Turma[]>('/turmas').then(setTurmas) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const turmaIds = vinculos.map(v => v.turmaId).filter(Boolean)
      await api.post('/alunos', { ...form, turmas: turmaIds })
      navigate('/alunos')
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/alunos')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Cadastrar Novo Aluno</h2>
          <p className="text-gray-500 mt-1">Preencha as informações do aluno</p>
        </div>
      </div>

      {erro && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{erro}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input placeholder="João da Silva" value={form.nome}
                  onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Matrícula *</Label>
                <Input placeholder="2026001234" value={form.matricula}
                  onChange={e => setForm(p => ({ ...p, matricula: e.target.value }))} required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Users className="w-5 h-5" /> Turmas do Aluno</div>
              <Button type="button" size="sm" className="gap-2"
                onClick={() => setVinculos(p => [...p, { id: crypto.randomUUID(), turmaId: '' }])}>
                <Plus className="w-4 h-4" /> Adicionar Turma
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {vinculos.map((v, i) => (
              <div key={v.id} className="flex items-end gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label>Turma {i + 1} {i === 0 ? '*' : ''}</Label>
                  <Select value={v.turmaId} required={i === 0}
                    onValueChange={val => setVinculos(p => p.map(x => x.id === v.id ? { ...x, turmaId: val } : x))}>
                    <SelectTrigger><SelectValue placeholder="Selecione a turma" /></SelectTrigger>
                    <SelectContent>
                      {turmas.map(t => <SelectItem key={t.id} value={t.id}>{t.nome} — {t.serie}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {vinculos.length > 1 && (
                  <Button type="button" variant="ghost" size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setVinculos(p => p.filter(x => x.id !== v.id))}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/alunos')}>Cancelar</Button>
          <Button type="submit" disabled={carregando} className="gap-2">
            <Save className="w-4 h-4" /> {carregando ? 'Salvando...' : 'Salvar Aluno'}
          </Button>
        </div>
      </form>
    </div>
  )
}
