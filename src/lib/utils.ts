import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatar valor em Real brasileiro
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Formatar data
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

// Formatar data com hora
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// Tempo relativo ("há 2 horas", "há 3 dias")
export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000)

  const intervals = [
    { label: 'ano', seconds: 31536000 },
    { label: 'mês', seconds: 2592000 },
    { label: 'dia', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `há ${count} ${interval.label}${count > 1 ? 's' : ''}`
    }
  }
  return 'agora'
}

// Iniciais do nome (para avatar)
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Cores para status
export const statusColors: Record<string, string> = {
  // Cliente
  lead: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  proposta: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  ativo: 'bg-green-500/10 text-green-500 border-green-500/20',
  pausado: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  churn: 'bg-red-500/10 text-red-500 border-red-500/20',
  // Projeto
  planejamento: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  em_andamento: 'bg-green-500/10 text-green-500 border-green-500/20',
  concluido: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  cancelado: 'bg-red-500/10 text-red-500 border-red-500/20',
  // Tarefa
  pendente: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  // Proposta
  rascunho: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  enviada: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  aceita: 'bg-green-500/10 text-green-500 border-green-500/20',
  recusada: 'bg-red-500/10 text-red-500 border-red-500/20',
  expirada: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
}

// Labels amigáveis
export const statusLabels: Record<string, string> = {
  lead: 'Lead',
  proposta: 'Proposta',
  ativo: 'Ativo',
  pausado: 'Pausado',
  churn: 'Churn',
  planejamento: 'Planejamento',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  pendente: 'Pendente',
  rascunho: 'Rascunho',
  enviada: 'Enviada',
  aceita: 'Aceita',
  recusada: 'Recusada',
  expirada: 'Expirada',
}



