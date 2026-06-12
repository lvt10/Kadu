import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { api } from '../lib/api'

interface NotaBimestral {
  id: number; materia: string; turmaNome: string; media_turma?: number
  bimestre1: number|null; bimestre2: number|null; bimestre3: number|null; bimestre4: number|null
}
interface Aluno { id: string; nome: string; matricula: string; pcd: boolean }

export default function Boletim() {
  const navigate = useNavigate()
  const { alunoId } = useParams()
  const [notas, setNotas] = useState<NotaBimestral[]>([])
  const [aluno, setAluno] = useState<Aluno | null>(null)

  useEffect(() => {
    api.get(`/notas/aluno/${alunoId}`).then(res => setNotas(res.data))
    api.get(`/alunos`).then(res => {
      const encontrado = res.data.find((a: any) => a.id === alunoId)
      if (encontrado) setAluno(encontrado)
    })
  }, [alunoId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2"/>Voltar</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Boletim Escolar {aluno?.pcd && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full ml-2">PCD</span>}
          </CardTitle>
          <p className="text-center text-muted-foreground">Aluno: {aluno?.nome} | Matrícula: {aluno?.matricula}</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-muted text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="border p-2 text-left">Matéria</th>
                  <th className="border p-2 text-center">1ºB</th>
                  <th className="border p-2 text-center">2ºB</th>
                  <th className="border p-2 text-center">3ºB</th>
                  <th className="border p-2 text-center">4ºB</th>
                  <th className="border p-2 text-center bg-blue-50">Média Turma</th>
                  <th className="border p-2 text-center bg-green-50">Média Geral</th>
                </tr>
              </thead>
              <tbody>
                {notas.map(n => {
                  const b1 = n.bimestre1 ?? 0; const b2 = n.bimestre2 ?? 0;
                  const b3 = n.bimestre3 ?? 0; const b4 = n.bimestre4 ?? 0;
                  const contados = [n.bimestre1, n.bimestre2, n.bimestre3, n.bimestre4].filter(v => v !== null).length;
                  const mediaGeral = contados > 0 ? ((b1 + b2 + b3 + b4) / contados).toFixed(1) : '-';

                  return (
                    <tr key={n.materia} className="hover:bg-accent">
                      <td className="border p-2 font-medium">{n.materia}</td>
                      <td className="border p-2 text-center">{n.bimestre1 ?? '-'}</td>
                      <td className="border p-2 text-center">{n.bimestre2 ?? '-'}</td>
                      <td className="border p-2 text-center">{n.bimestre3 ?? '-'}</td>
                      <td className="border p-2 text-center">{n.bimestre4 ?? '-'}</td>
                      <td className="border p-2 text-center font-semibold bg-blue-50 text-blue-700">{n.media_turma ?? '-'}</td>
                      <td className="border p-2 text-center font-bold bg-green-50 text-green-700">{mediaGeral}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
