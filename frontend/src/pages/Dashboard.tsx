import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { Users, FileText, CheckSquare, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDashboard } from '../hooks'

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-20 mb-2" />
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-44" /></CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start justify-between border-b pb-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="ml-4 space-y-1 text-right">
                  <Skeleton className="h-6 w-16 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data, loading } = useDashboard()

  if (loading || !data) return <DashboardSkeleton />

  const diasAteEntrega = (dataEntrega: string) =>
    Math.ceil((new Date(dataEntrega).getTime() - Date.now()) / 86400000)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total de Alunos',   valor: data.totalAlunos,            sub: `Em ${data.totalTurmas} turmas`,                                          icone: Users },
          { label: 'Atividades Ativas', valor: data.atividadesAtivas,        sub: 'Pendentes de correção',                                                   icone: FileText },
          { label: 'Presença Hoje',     valor: `${data.presencaHoje.taxa}%`, sub: `${data.presencaHoje.presentes} de ${data.presencaHoje.total} presentes`, icone: CheckSquare },
          { label: 'Média Geral',       valor: data.mediaGeral.toFixed(1),   sub: 'Média de todas as notas',                                                icone: TrendingUp },
        ].map(({ label, valor, sub, icone: Icone }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
              <Icone className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{valor}</div>
              <p className="text-xs text-gray-500 mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Distribuição de Notas</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.distribuicaoNotas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nota" /><YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#3b82f6" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Próximas Atividades</CardTitle></CardHeader>
          <CardContent>
            {data.proximasAtividades.length === 0
              ? <p className="text-center text-gray-500 py-8">Nenhuma atividade ativa</p>
              : (
                <div className="space-y-4">
                  {data.proximasAtividades.map(at => {
                    const dias = diasAteEntrega(at.data_entrega)
                    return (
                      <div key={at.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{at.titulo}</p>
                          <p className="text-sm text-gray-500">{at.turmaNome}</p>
                        </div>
                        <div className="text-right ml-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${dias <= 2 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                            {dias === 0 ? 'Hoje' : dias === 1 ? 'Amanhã' : dias < 0 ? 'Vencida' : `${dias} dias`}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{at.entregues}/{at.qtdAlunos} entregues</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
