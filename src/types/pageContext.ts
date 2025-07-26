// src/types/pageContext.ts
import type { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'
import type { ReactNode } from 'react'
import type { 
  PageContextServer as PageContextServerBuiltIn 
} from 'vite-plugin-ssr/types'

// Tipos para dados financeiros
export interface FinancialState {
  accounts: Account[]
  incomes: Income[]
  expenses: Expense[]
  debts: Debt[]
}

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

export interface ProjectionData {
  year: number
  netWorth: number
  totalDebt: number
  savings: number
  initialDebt?: number 
}

export interface FinancialHealth {
  score: number
  status: string
  savingsRate: number
  debtToAssetRatio: number
  emergencyFundMonths: number
}
// Props das páginas
export type PageProps = {
  initialFinancialData?: FinancialState
}

// Componente de página
export type Page = (props: PageProps) => ReactNode

// Context customizado do servidor (renomeado para evitar conflito)
export type PageContextCustomServer = PageContextServerBuiltIn & {
  Page: Page
  pageProps?: PageProps
  routeParams: Record<string, string>
}

// Context customizado do cliente  
export type PageContext = PageContextBuiltInClientWithClientRouting & {
  Page: Page
  pageProps?: PageProps
  routeParams: Record<string, string>
}