import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { BookOpen, Users, GraduationCap, LogOut } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Logo } from '../components/Logo'

const navegacao = [
  { nome: 'Turmas', href: '/turmas', icone: BookOpen },
  { nome: 'Alunos', href: '/alunos', icone: Users },
  { nome: 'Notas',  href: '/notas',  icone: GraduationCap },
]

function obterIniciais(nome: string) {
  return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Root() {
  const location = useLocation()
  const navigate  = useNavigate()

  const professorNome  = localStorage.getItem('professorNome')  || 'Professor'
  const professorAuth  = localStorage.getItem('professorAuth')

  useEffect(() => {
    if (!professorAuth) navigate('/login', { replace: true })
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-3 md:p-6 border-b border-gray-200">
          <Logo />
          <p className="text-sm text-gray-500 mt-1 text-center hidden md:block">Portal do Professor</p>
        </div>

        <nav className="flex-1 p-2 md:p-4 space-y-1">
          {navegacao.map(item => {
            const ativo = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
            const Icone = item.icone
            return (
              <Link key={item.nome} to={item.href} title={item.nome}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors justify-center md:justify-start ${
                  ativo ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <Icone className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium hidden md:inline">{item.nome}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-2 md:p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 justify-center md:justify-start">
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                {obterIniciais(professorNome)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 hidden md:block">
              <p className="text-sm font-medium text-gray-900 truncate">{professorNome}</p>
            </div>
          </div>
          <Button variant="ghost"
            className="w-full mt-2 justify-center md:justify-start gap-2 text-gray-700"
            onClick={handleLogout} title="Sair">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sair</span>
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
