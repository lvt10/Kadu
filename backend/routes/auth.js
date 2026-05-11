'use strict'
const router       = require('express').Router()
const auth         = require('../middleware/auth')
const AuthService  = require('../services/AuthService')
const ProfessorRepository = require('../repositories/ProfessorRepository')
const bcrypt       = require('bcryptjs')
const jwt          = require('jsonwebtoken')
const { db }       = require('../db/connection')
const { Resend }   = require('resend')
const { emailVerificacao, emailSenhaTemporaria } = require('../db/emailTemplates')

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── Login ────────────────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, senha } = req.body
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios' })
  const result = AuthService.login(email, senha)
  if (!result) return res.status(401).json({ erro: 'Email ou senha inválidos' })
  res.json(result)
})

// ─── Registro: Passo 1 — envia código por email ───────────────────────────────
router.post('/registro/enviar-codigo', async (req, res) => {
  const { nome, email, senha } = req.body
  if (!nome || !email || !senha)
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' })

  // Validação de senha forte
  const senhaValida = /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}/.test(senha)
  if (!senhaValida)
    return res.status(400).json({ erro: 'A senha deve ter no mínimo 8 caracteres, uma letra, um número e um caractere especial' })

  const existe = ProfessorRepository.findByEmail(email)
  if (existe) return res.status(409).json({ erro: 'Este email já está cadastrado' })

  const codigo    = String(Math.floor(100000 + Math.random() * 900000))
  const expira_em = Date.now() + 10 * 60 * 1000
  const hash      = bcrypt.hashSync(senha, 10)

  db.prepare('DELETE FROM codigos_verificacao WHERE email = ?').run(email)
  db.prepare('INSERT INTO codigos_verificacao (email, codigo, nome, senha, expira_em) VALUES (?, ?, ?, ?, ?)')
    .run(email, codigo, nome, hash, expira_em)

  await resend.emails.send({
    from:    'Kadu <onboarding@resend.dev>',
    to:      email,
    subject: 'Código de verificação — Kadu',
    html:    emailVerificacao(nome, codigo),
  })

  res.json({ mensagem: 'Código enviado para o email' })
})

// ─── Registro: Passo 2 — valida código e cria conta ──────────────────────────
router.post('/registro/verificar', (req, res) => {
  const { email, codigo } = req.body
  if (!email || !codigo) return res.status(400).json({ erro: 'Email e código obrigatórios' })

  const registro = db.prepare(
    'SELECT * FROM codigos_verificacao WHERE email = ? AND usado = 0 ORDER BY id DESC LIMIT 1'
  ).get(email)

  if (!registro)
    return res.status(400).json({ erro: 'Código não encontrado. Solicite um novo.' })
  if (Date.now() > registro.expira_em)
    return res.status(400).json({ erro: 'Código expirado. Solicite um novo.' })
  if (registro.codigo !== codigo)
    return res.status(400).json({ erro: 'Código incorreto.' })

  db.prepare('UPDATE codigos_verificacao SET usado = 1 WHERE id = ?').run(registro.id)
  db.prepare('INSERT INTO professores (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(registro.nome, registro.email, registro.senha)

  const prof  = ProfessorRepository.findByEmail(email)
  const token = jwt.sign(
    { id: prof.id, email: prof.email },
    process.env.JWT_SECRET || 'escola-secret-dev-key',
    { expiresIn: '7d' }
  )

  res.status(201).json({ token, professor: { id: prof.id, nome: prof.nome, email: prof.email } })
})

// ─── Esqueci minha senha ──────────────────────────────────────────────────────
router.post('/esqueci-senha', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ erro: 'Email obrigatório' })

  const prof = ProfessorRepository.findByEmail(email)
  if (!prof) return res.status(404).json({ erro: 'Email não encontrado' })

  const senhaTemp = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase()
  const hash      = bcrypt.hashSync(senhaTemp, 10)

  db.prepare('UPDATE professores SET senha_hash = ? WHERE email = ?').run(hash, email)

  await resend.emails.send({
    from:    'Kadu <onboarding@resend.dev>',
    to:      email,
    subject: 'Sua nova senha temporária — Kadu',
    html:    emailSenhaTemporaria(prof.nome, senhaTemp),
  })

  res.json({ mensagem: 'Senha temporária enviada para o email' })
})

// ─── Me ───────────────────────────────────────────────────────────────────────
router.get('/me', auth, (req, res) => {
  const prof = ProfessorRepository.findById(req.user.id)
  if (!prof) return res.status(404).json({ erro: 'Não encontrado' })
  res.json(prof)
})

module.exports = router