import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { ArrowLeft, Save, BookOpen } from 'lucide-react'
import { api } from '../lib/api'

const series      = ['1º Ano','2º Ano','3º Ano','4º Ano','5º Ano','6º Ano','7º Ano','8º Ano','9º Ano']
const disciplinas = ['Matemática','Português','Ciências','História','Geografia','Inglês','Educação Física','Arte','Física','Química','Biologia']
const periodos    = ['Manhã','Tarde']

const codigos: Record<string, string> = {
  'Matemática':'MAT','Português':'POR','Ciências':'CIE','História':'HIS','Geografia':'GEO',
  'Inglês':'ING','Educação Física':'EDU','Arte':'ART','Física':'FIS','Química':'QUI','Biologia':'BIO',
}

export default function CadastroTurma() {
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    disciplina: '', serie: '', periodo: '', nome: '', codigo: '', ano: new Date().getFullYear().toString(), sala: '',
  })

  useEffect(() => {
    if (form.disciplina && form.serie && form.periodo) {
      const serie0 = form.serie.charAt(0)
      const per0   = form.periodo.charAt(0).toUpperCase()
      setForm(prev => ({
        ...prev,
        nome:   `${form.disciplina} - ${form.serie} - ${form.periodo}`,
        codigo: `${codigos[form.disciplina]}-${serie0}A-${per0}`,
      }))
    }
  }, [form.disciplina, form.serie, form.periodo])

  const set = (k: string) => (v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await api.post('/turmas', { ...form, ano: Number(form.ano) })
      navigate('/turmas')
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/turmas')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Cadastrar Nova Turma</h2>
          <p className="text-gray-500 mt-1">Preencha as informações da turma</p>
        </div>
      </div>

      {erro && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{erro}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Informações da Turma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Disciplina *</Label>
                <Select value={form.disciplina} onValueChange={set('disciplina')} required>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{disciplinas.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Série *</Label>
                <Select value={form.serie} onValueChange={set('serie')} required>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{series.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Período *</Label>
                <Select value={form.periodo} onValueChange={set('periodo')} required>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{periodos.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {form.nome && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
                <p className="text-sm font-medium text-blue-900">Nome: <span className="font-bold">{form.nome}</span></p>
                <p className="text-sm font-medium text-blue-900">Código: <span className="font-bold">{form.codigo}</span></p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ano Letivo *</Label>
                <Input type="number" value={form.ano} onChange={e => set('ano')(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Sala</Label>
                <Input placeholder="Ex: 101" value={form.sala} onChange={e => set('sala')(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/turmas')}>Cancelar</Button>
          <Button type="submit" disabled={carregando} className="gap-2">
            <Save className="w-4 h-4" /> {carregando ? 'Salvando...' : 'Salvar Turma'}
          </Button>
        </div>
      </form>
    </div>
  )
}
