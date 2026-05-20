export function corNota(nota: number | null): string {
  if (nota === null) return 'text-gray-400'
  if (nota >= 9) return 'text-green-600'
  if (nota >= 6) return 'text-blue-600'
  return 'text-red-600'
}

export type StatusNota = 'Aprovado' | 'Reprovado' | 'Pendente'

export function statusNota(media: number | null): StatusNota {
  if (media === null) return 'Pendente'
  return media >= 6 ? 'Aprovado' : 'Reprovado'
}

export function varianteBadge(status: StatusNota): 'default' | 'secondary' | 'destructive' {
  if (status === 'Aprovado') return 'default'
  if (status === 'Pendente') return 'secondary'
  return 'destructive'
}
