import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { User, Mail, Lock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { Logo } from '../components/Logo'
import { api } from '../lib/api'

export default function Registro() {
  const navigate = useNavigate()
  const [etapa,         setEtapa]         = useState<'formulario' | 'codigo'>('formulario')
  const [nome,          setNome]          = useState('')
  const [email,         setEmail]         = useState('')
  const [senha,         setSenha]         = useState('')
  const [confirmar,     setConfirmar]     = useState('')
  const [codigo,        setCodigo]        = useState('')
  const [erro,          setErro]          = useState('')
  const [carregando,    setCarregando]    = useState(false)
  const [reenvioTimer,  setReenvioTimer]  = useState(0)
  const [reenvioMsg,    setReenvioMsg]    = useState('')

  const senhaRequisitos = [
    { ok: senha.length >= 8,           texto: 'Mínimo 8 caracteres' },
    { ok: /[a-zA-Z]/.test(senha),      texto: 'Pelo menos uma letra' },
    { ok: /[0-9]/.test(senha),         texto: 'Pelo menos um número' },
    { ok: /[^a-zA-Z0-9]/.test(senha),  texto: 'Pelo menos um caractere especial (!@#$%...)' },
  ]
  const senhaValida = senhaRequisitos.every(r => r.ok)

  // Inicia contagem regressiva de X segundos
  function iniciarTimer(segundos: number) {
    setReenvioTimer(segundos)
    const intervalo = setInterval(() => {
      setReenvioTimer(prev => {
        if (prev <= 1) { clearInterval(intervalo); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleEnviarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (senha !== confirmar) return setErro('As senhas não coincidem')
    if (!senhaValida)        return setErro('A senha não atende aos requisitos mínimos')

    setCarregando(true)
    try {
      await api.post('/auth/registro/enviar-codigo', { nome, email, senha })
      setEtapa('codigo')
      iniciarTimer(60)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao enviar código')
    } finally {
      setCarregando(false)
    }
  }

  const handleReenviar = async () => {
    if (reenvioTimer > 0) return
    setErro('')
    setReenvioMsg('')
    setCarregando(true)
    try {
      await api.post('/auth/registro/enviar-codigo', { nome, email, senha })
      setCodigo('')
      setReenvioMsg('Novo código enviado com sucesso!')
      iniciarTimer(60)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao reenviar código')
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
                      <Input type="password" placeholder="Mínimo 8 caracteres" value={senha}
                        onChange={e => setSenha(e.target.value)} className="pl-10" required />
                    </div>
                    {senha && (
                      <div className="space-y-1 mt-1">
                        {senhaRequisitos.map(({ ok, texto }) => (
                          <div key={texto} className={`flex items-center gap-2 text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                            <span>{ok ? '✓' : '○'}</span>
                            <span>{texto}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type="password" placeholder="Repita a senha" value={confirmar}
                        onChange={e => setConfirmar(e.target.value)} className="pl-10" required />
                    </div>
                    {confirmar && (
                      <p className={`text-xs flex items-center gap-1 ${senha === confirmar ? 'text-green-600' : 'text-red-500'}`}>
                        <span>{senha === confirmar ? '✓' : '✗'}</span>
                        {senha === confirmar ? 'Senhas coincidem' : 'Senhas não coincidem'}
                      </p>
                    )}
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

                  {reenvioMsg && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-600">{reenvioMsg}</p>
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

                  {/* Botão de reenvio com timer */}
                  <div className="text-center">
                    {reenvioTimer > 0 ? (
                      <p className="text-sm text-gray-400">
                        Reenviar código em <span className="font-semibold text-gray-600">{reenvioTimer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleReenviar}
                        disabled={carregando}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium mx-auto disabled:opacity-50">
                        <RefreshCw className="w-4 h-4" />
                        Não recebi o código — reenviar
                      </button>
                    )}
                  </div>

                  <Button type="button" variant="ghost" className="w-full"
                    onClick={() => { setEtapa('formulario'); setErro(''); setReenvioMsg('') }}>
                    Voltar e alterar dados
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2026 Kadu. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}