import type { ReactNode } from 'react'

// Definições de tipos para dados financeiros
export interface Account {
  id: string
  name: string
  balance: number
  type: 'checking' | 'savings' | 'investment'
}

export interface Income {
  id: string
  description: string
  amount: number
  frequency: 'monthly' | 'yearly'
}

export interface Expense {
  id: string
  category: string
  description: string
  amount: number
  frequency: 'monthly' | 'yearly'
}

export interface Debt {
  id: string
  description: string
  amount: number
  interestRate: number
  monthlyPayment: number
}

export interface FinancialState {
  accounts: Account[]
  incomes: Income[]
  expenses: Expense[]
  debts: Debt[]
}

export interface ProjectionData {
  year: number
  netWorth: number
  totalDebt: number
  savings: number
   initialDebt?: number 
}

// Tipos específicos do SSR
export interface PageProps {
  // Dados iniciais que podem vir do servidor
  initialFinancialData?: FinancialState
  user?: {
    id: string
    name: string
    email: string
  }
}

export interface PageContextBase {
  Page: (pageProps: PageProps) => ReactNode
  pageProps?: PageProps
  routeParams: Record<string, string>
  urlPathname: string
  urlParsed: {
    pathname: string
    search: Record<string, string>
  }
  // Dados que são passados do servidor para o cliente
  exports: {
    passToClient?: string[]
  }
  // Dados específicos da nossa aplicação
  user?: PageProps['user']
  isHydrated?: boolean
}

export type PageContext = PageContextBase