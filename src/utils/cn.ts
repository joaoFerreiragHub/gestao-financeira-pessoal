/**
 * Utility function para combinar classes CSS de forma simples
 * Versão sem dependências externas para evitar problemas
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Formatador de moeda para EUR (Portugal)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Formatador de números com separadores
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-PT').format(value)
}

/**
 * Formatador de percentagem
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Gerar ID único
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Calcular a diferença percentual entre dois valores
 */
export function calculatePercentageChange(
  currentValue: number,
  previousValue: number
): { percentage: number; isPositive: boolean } | null {
  if (!previousValue || previousValue === 0) return null
  
  const change = ((currentValue - previousValue) / previousValue) * 100
  return {
    percentage: Math.abs(change),
    isPositive: change >= 0
  }
}

/**
 * Truncar texto com reticências
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Converter frequência para valor mensal
 */
export function convertToMonthly(amount: number, frequency: 'monthly' | 'yearly'): number {
  return frequency === 'monthly' ? amount : amount / 12
}

/**
 * Converter frequência para valor anual
 */
export function convertToYearly(amount: number, frequency: 'monthly' | 'yearly'): number {
  return frequency === 'yearly' ? amount : amount * 12
}

/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Capitalizar primeira letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Sleep function para delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}