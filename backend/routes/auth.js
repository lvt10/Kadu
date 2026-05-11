'use strict'
const router       = require('express').Router()
const auth         = require('../middleware/auth')
const AuthService  = require('../services/AuthService')
const ProfessorRepository = require('../repositories/ProfessorRepository')
const bcrypt       = require('bcryptjs')
const { db }       = require('../db/connection')
const { Resend }   = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios' })
  const result = AuthService.login(email, senha)
  if (!result) return res.status(401).json({ erro: 'Email ou senha inválidos' })
  res.json(result)
})

// Passo 1 — envia código por email
router.post('/registro/enviar-codigo', async (req, res) => {
  const { nome, email, senha } = req.body
  if (!nome || !email || !senha)
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' })
  if (senha.length < 6)
    return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres' })

  const existe = ProfessorRepository.findByEmail(email)
  if (existe) return res.status(409).json({ erro: 'Este email já está cadastrado' })

  // Gera código de 6 dígitos
  const codigo    = String(Math.floor(100000 + Math.random() * 900000))
  const expira_em = Date.now() + 10 * 60 * 1000 // 10 minutos
  const hash      = bcrypt.hashSync(senha, 10)

  // Remove códigos antigos do mesmo email
  db.prepare('DELETE FROM codigos_verificacao WHERE email = ?').run(email)

  // Salva novo código
  db.prepare('INSERT INTO codigos_verificacao (email, codigo, nome, senha, expira_em) VALUES (?, ?, ?, ?, ?)')
    .run(email, codigo, nome, hash, expira_em)

  // Envia email
  await resend.emails.send({
    from:    'Kadu <noreply@seudominio.com>',
    to:      email,
    subject: 'Código de verificação — Kadu',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="color:#0e7490;">Bem-vindo(a) ao Kadu!</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Use o código abaixo para confirmar seu cadastro:</p>
        <div style="background:#ecfeff;border:2px solid #06b6d4;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
          <span style="font-size:40px;font-weight:800;letter-spacing:10px;color:#0e7490;">${codigo}</span>
        </div>
        <p style="color:#64748b;font-size:14px;">Este código expira em <strong>10 minutos</strong>.</p>
        <p style="color:#64748b;font-size:14px;">Se você não solicitou isso, ignore este email.</p>
      </div>
    `,
  })

  res.json({ mensagem: 'Código enviado para o email' })
})

// Passo 2 — valida código e cria conta
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

  // Marca como usado
  db.prepare('UPDATE codigos_verificacao SET usado = 1 WHERE id = ?').run(registro.id)

  // Cria o professor
  db.prepare('INSERT INTO professores (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(registro.nome, registro.email, registro.senha)

  const result = AuthService.login(email, bcrypt.hashSync('dummy', 10))

  // Login direto após registro
  const prof  = ProfessorRepository.findByEmail(email)
  const jwt   = require('jsonwebtoken')
  const token = jwt.sign({ id: prof.id, email: prof.email }, process.env.JWT_SECRET || 'escola-secret-dev-key', { expiresIn: '7d' })

  res.status(201).json({ token, professor: { id: prof.id, nome: prof.nome, email: prof.email } })
})

router.get('/me', auth, (req, res) => {
  const prof = ProfessorRepository.findById(req.user.id)
  if (!prof) return res.status(404).json({ erro: 'Não encontrado' })
  res.json(prof)
})

module.exports = router
