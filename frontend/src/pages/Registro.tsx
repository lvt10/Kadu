import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { Logo } from '../components/Logo'
import { api } from '../lib/api'

export default function Registro() {
  const navigate = useNavigate()
  const [etapa,      setEtapa]      = useState<'formulario' | 'codigo'>('formulario')
  const [nome,       setNome]       = useState('')
  const [email,      setEmail]      = useState('')
  const [senha,      setSenha]      = useState('')
  const [confirmar,  setConfirmar]  = useState('')
  const [codigo,     setCodigo]     = useState('')
  const [erro,       setErro]       = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleEnviarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (senha !== confirmar) return setErro('As senhas não coincidem')
    if (senha.length < 6)    return setErro('A senha deve ter no mínimo 6 caracteres')

    setCarregando(true)
    try {
      await api.post('/auth/registro/enviar-codigo', { nome, email, senha })
      setEtapa('codigo')
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao enviar código')
    } finally {
      setCarregando(false)
    }
  }

  const handleVerificar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const data = await api.post<{ token: string; professor: { id: number; nome: string; email: string } }>(
        '/auth/registro/verificar',
        { email, codigo }
      )
      localStorage.setItem('token', data.token)
      localStorage.setItem('professorAuth', 'autenticado')
      localStorage.setItem('professorNome', data.professor.nome)
      localStorage.setItem('professorEmail', data.professor.email)
      navigate('/turmas', { replace: true })
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao verificar código')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showText={true} className="mb-4" />
        </div>

        <Card className="shadow-xl">
          {etapa === 'formulario' ? (
            <>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>Preencha os dados para se cadastrar</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnviarCodigo} className="space-y-4">
                  {erro && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-600">{erro}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="Prof. Maria Silva" value={nome}
                        onChange={e => setNome(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type="email" placeholder="professora@escola.edu.br" value={email}
                        onChange={e => setEmail(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type="password" placeholder="Mínimo 6 caracteres" value={senha}
                        onChange={e => setSenha(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type="password" placeholder="Repita a senha" value={confirmar}
                        onChange={e => setConfirmar(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={carregando}>
                    {carregando ? 'Enviando código...' : 'Enviar Código de Verificação'}
                  </Button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-blue-600 font-medium hover:underline">Fazer login</Link>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Verifique seu email
                </CardTitle>
                <CardDescription>
                  Enviamos um código de 6 dígitos para <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerificar} className="space-y-4">
                  {erro && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-600">{erro}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Código de Verificação</Label>
                    <Input
                      placeholder="000000"
                      value={codigo}
                      onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-3xl font-bold tracking-widest h-16"
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-gray-500 text-center">O código expira em 10 minutos</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={carregando || codigo.length < 6}>
                    {carregando ? 'Verificando...' : 'Confirmar Cadastro'}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full"
                    onClick={() => { setEtapa('formulario'); setErro('') }}>
                    Voltar e alterar dados
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
