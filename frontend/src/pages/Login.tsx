import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { Checkbox } from '../components/ui/checkbox'
import { Logo } from '../components/Logo'
import { api } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrarMe, setLembrarMe] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const data = await api.post<{ token: string; professor: { id: number; nome: string; email: string } }>(
        '/auth/login',
        { email, senha }
      )
      localStorage.setItem('token', data.token)
      localStorage.setItem('professorAuth', 'autenticado')
      localStorage.setItem('professorNome', data.professor.nome)
      localStorage.setItem('professorEmail', data.professor.email)
      if (lembrarMe) localStorage.setItem('lembrarMe', 'true')
      navigate('/turmas', { replace: true })
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao fazer login')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showText={true} className="mb-4" />
          <p className="text-gray-600 mt-2">Acesse o portal do professor</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Bem-vindo(a)</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o painel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {erro && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-600">{erro}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="professor@escola.edu.br"
                    value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="senha" type="password" placeholder="••••••••"
                    value={senha} onChange={e => setSenha(e.target.value)} className="pl-10" required />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="lembrar" checked={lembrarMe}
                    onCheckedChange={checked => setLembrarMe(checked as boolean)} />
                  <Label htmlFor="lembrar" className="text-sm font-normal cursor-pointer">Lembrar-me</Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={carregando}>
                {carregando ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-center text-sm text-gray-600">
                Precisa de ajuda?{' '}
                <Button variant="link" className="h-auto p-0 text-sm">Contate o Suporte de TI</Button>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <p className="text-sm text-blue-900 font-medium mb-2">Credenciais de Demonstração</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>E-mail: professor@escola.edu.br</p>
              <p>Senha: demo123</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2026 Kadu. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
