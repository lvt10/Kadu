import { createBrowserRouter } from 'react-router'
import Root              from './pages/Root'
import Login             from './pages/Login'
import Registro          from './pages/Registro'
import Turmas            from './pages/Turmas'
import CadastroTurma     from './pages/CadastroTurma'
import DetalhesTurma     from './pages/DetalhesTurma'
import Alunos            from './pages/Alunos'
import CadastroAluno     from './pages/CadastroAluno'
import Boletim           from './pages/Boletim'
import NotasListaTurmas      from './pages/NotasListaTurmas'
import NotasListaAlunos      from './pages/NotasListaAlunos'
import NotasLancamento       from './pages/NotasLancamento'
import NotasLancamentoTurma  from './pages/NotasLancamentoTurma'
import Dashboard         from './pages/Dashboard'

export const router = createBrowserRouter([
  { path: '/login',    element: <Login /> },
  { path: '/registro', element: <Registro /> },
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true,                                  element: <Dashboard /> },
      { path: 'turmas',                               element: <Turmas /> },
      { path: 'turmas/cadastrar',                     element: <CadastroTurma /> },
      { path: 'turmas/:turmaId',                      element: <DetalhesTurma /> },
      { path: 'alunos',                               element: <Alunos /> },
      { path: 'alunos/cadastrar',                     element: <CadastroAluno /> },
      { path: 'alunos/:alunoId/boletim',              element: <Boletim /> },
      { path: 'notas',                                        element: <NotasListaTurmas /> },
      { path: 'notas/turma/:turmaId',                       element: <NotasListaAlunos /> },
      { path: 'notas/turma/:turmaId/lancamento',            element: <NotasLancamentoTurma /> },
      { path: 'notas/turma/:turmaId/aluno/:alunoId',        element: <NotasLancamento /> },
    ],
  },
])
