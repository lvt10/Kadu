'use strict'
const { DatabaseSync } = require('node:sqlite')
const path = require('path')

const DB_PATH = process.env.DB_PATH || (
  process.env.WEBSITE_INSTANCE_ID
    ? '/home/data/escola.db'
    : path.join(__dirname, '..', 'escola.db')
)

const db = new DatabaseSync(DB_PATH)
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

db.exec(`CREATE TABLE IF NOT EXISTS professores (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  senha_hash TEXT    NOT NULL,
  created_at TEXT    DEFAULT (datetime('now'))
)`)

db.exec(`CREATE TABLE IF NOT EXISTS turmas (
  id           TEXT    PRIMARY KEY,
  nome         TEXT    NOT NULL,
  codigo       TEXT    NOT NULL,
  disciplina   TEXT    NOT NULL,
  serie        TEXT    NOT NULL,
  periodo      TEXT    NOT NULL,
  ano          INTEGER NOT NULL,
  sala         TEXT    DEFAULT '',
  cor          TEXT    DEFAULT 'bg-blue-500',
  professor_id INTEGER REFERENCES professores(id),
  created_at   TEXT    DEFAULT (datetime('now'))
)`)

db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_turma_codigo_professor ON turmas(codigo, professor_id)`)

db.exec(`CREATE TABLE IF NOT EXISTS alunos (
  id         TEXT    PRIMARY KEY,
  nome       TEXT    NOT NULL,
  matricula  TEXT    NOT NULL UNIQUE,
  email      TEXT    DEFAULT '',
  serie      TEXT    DEFAULT '',
  pcd        INTEGER DEFAULT 0,
  created_at TEXT    DEFAULT (datetime('now'))
)`)

// Migração: adiciona coluna pcd em bancos já existentes
try { db.exec(`ALTER TABLE alunos ADD COLUMN pcd INTEGER DEFAULT 0`) } catch (_) {}

db.exec(`CREATE TABLE IF NOT EXISTS aluno_turma (
  aluno_id TEXT NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  turma_id TEXT NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  PRIMARY KEY (aluno_id, turma_id)
)`)

db.exec(`CREATE TABLE IF NOT EXISTS notas_bimestrais (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  aluno_id  TEXT    NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  turma_id  TEXT    NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  materia   TEXT    DEFAULT '',
  bimestre1 REAL, bimestre2 REAL, bimestre3 REAL, bimestre4 REAL,
  UNIQUE(aluno_id, turma_id)
)`)

db.exec(`CREATE TABLE IF NOT EXISTS atividades (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo       TEXT    NOT NULL,
  turma_id     TEXT    NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  data_entrega TEXT    NOT NULL,
  status       TEXT    DEFAULT 'ativa',
  entregues    INTEGER DEFAULT 0,
  created_at   TEXT    DEFAULT (datetime('now'))
)`)

db.exec(`CREATE TABLE IF NOT EXISTS registros_presenca (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  aluno_id TEXT    NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  turma_id TEXT    NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  data     TEXT    NOT NULL,
  status   TEXT    NOT NULL,
  UNIQUE(aluno_id, turma_id, data)
)`)

db.exec(`CREATE TABLE IF NOT EXISTS codigos_verificacao (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  email     TEXT    NOT NULL,
  codigo    TEXT    NOT NULL,
  nome      TEXT    NOT NULL,
  senha     TEXT    NOT NULL,
  expira_em INTEGER NOT NULL,
  usado     INTEGER DEFAULT 0
)`)

const plain    = r  => r  ? Object.assign({}, r)  : null
const plainAll = rs => rs.map(r => Object.assign({}, r))

function transacao(fn) {
  db.exec('BEGIN')
  try { fn(); db.exec('COMMIT') }
  catch (e) { db.exec('ROLLBACK'); throw e }
}

module.exports = { db, plain, plainAll, transacao }
