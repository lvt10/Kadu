// src/lib/api.ts
// Cliente HTTP centralizado — sem dependências externas

const BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api'

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: getHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (res.status === 401) {
    localStorage.clear()
    window.location.href = '/login'
    throw new Error('Não autorizado')
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data?.erro || `Erro ${res.status}`)
  }

  return data as T
}

export const api = {
  get:    <T = unknown>(path: string)                  => request<T>('GET', path),
  post:   <T = unknown>(path: string, body: unknown)   => request<T>('POST', path, body),
  put:    <T = unknown>(path: string, body: unknown)   => request<T>('PUT', path, body),
  delete: <T = unknown>(path: string)                  => request<T>('DELETE', path),
}
