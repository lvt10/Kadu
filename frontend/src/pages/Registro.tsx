import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { User, Mail, Lock, AlertCircle } from 'lucide-react'
import { Logo } from '../components/Logo'
import { api } from '../lib/api'

export default function Registro() {
  const navigate = useNavigate()
  const [nome,       setNome]       = useState('')
  const [email,      setEmail]      = useState('')
  const [senha,      setSenha]      = useState('')
  const [confirmar,  setConfirmar]  = useState('')
  const [erro,       setErro]       = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (senha !== confirmar) {
      setErro('As senhas não coincidem')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setCarregando(true)
    try {
      const data = await api.post<{ token: string; professor: { id: number; nome: string; email: string } }>(
        '/auth/registro',
        { nome, email, senha }
      )
      localStorage.setItem('token', data.token)
      localStorage.setItem('professorAuth', 'autenticado')
      localStorage.setItem('professorNome', data.professor.nome)
      localStorage.setItem('professorEmail', data.professor.email)
      navigate('/turmas', { replace: true })
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao criar conta')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showText={true} className="mb-4" />
          <p className="text-gray-600 mt-2">Crie sua conta de professor</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>Preencha os dados para se cadastrar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegistro} className="space-y-4">
              {erro && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{erro}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="nome" placeholder="Prof. Maria Silva"
                    value={nome} onChange={e => setNome(e.target.value)}
                    className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="professora@escola.edu.br"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="senha" type="password" placeholder="Mínimo 6 caracteres"
                    value={senha} onChange={e => setSenha(e.target.value)}
                    className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmar">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="confirmar" type="password" placeholder="Repita a senha"
                    value={confirmar} onChange={e => setConfirmar(e.target.value)}
                    className="pl-10" required />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={carregando}>
                {carregando ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Fazer login
              </Link>
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
