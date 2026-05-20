export function corNota(nota: number | null): string {
  if (nota === null) return 'text-gray-400'
  if (nota >= 9) return 'text-green-600'
  if (nota >= 7) return 'text-blue-600'
  if (nota >= 5) return 'text-yellow-600'
  return 'text-red-600'
}

export type StatusNota = 'Aprovado' | 'Recuperação' | 'Reprovado' | 'Pendente'

export function statusNota(media: number | null): StatusNota {
  if (media === null) return 'Pendente'
  if (media >= 7) return 'Aprovado'
  if (media >= 5) return 'Recuperação'
  return 'Reprovado'
}

export function varianteBadge(status: StatusNota): 'default' | 'secondary' | 'destructive' {
  if (status === 'Aprovado') return 'default'
  if (status === 'Pendente') return 'secondary'
  return 'destructive'
}
