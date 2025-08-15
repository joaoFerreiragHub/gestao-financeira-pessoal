// ===== TIPOS PRINCIPAIS =====

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

export interface FinancialHealthData {
  score: number
  status: string
  savingsRate: number
  debtToAssetRatio: number
  emergencyFundMonths: number
}

// ===== TIPOS PARA COMPONENTES =====

export interface User {
  name: string
  email: string
  avatar: string
  plan: string
}

export interface FinancialSummary {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  netWorth: number
}

export interface MetricsData {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  netWorth: number
  monthlySavings: number
}

export interface QuickActionsData {
  accountsCount: number
  incomesCount: number
  expensesCount: number
  debtsCount: number
}

// ===== PROPS DOS COMPONENTES =====

export interface FinancialHealthCardProps {
  healthData: FinancialHealthData
  showValues?: boolean
}

export interface MetricGridProps {
  financialData: MetricsData
  showBalances: boolean
  onToggleBalances: () => void
  loading?: boolean
}

export interface QuickActionsProps {
  onNavigate: (section: string) => void
  financialData?: QuickActionsData
}

export interface EnhancedSidebarProps {
  user?: User
  financialSummary?: FinancialSummary
  activeSection: string
  onSectionChange?: (section: string) => void
  onLogout?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

// ===== TOAST TYPES =====

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// ===== UTILITÁRIOS DE CÁLCULO =====

/**
 * Converter valor para mensal baseado na frequência
 */
export const calculateMonthlyAmount = (
  amount: number, 
  frequency: 'monthly' | 'yearly'
): number => {
  return frequency === 'monthly' ? amount : amount / 12
}

/**
 * Converter valor para anual baseado na frequência
 */
export const calculateYearlyAmount = (
  amount: number, 
  frequency: 'monthly' | 'yearly'
): number => {
  return frequency === 'monthly' ? amount * 12 : amount
}

/**
 * Calcular total de saldos das contas
 */
export const calculateTotalBalance = (accounts: Account[]): number => {
  return accounts.reduce((sum, account) => sum + account.balance, 0)
}

/**
 * Calcular rendimento mensal total
 */
export const calculateMonthlyIncome = (incomes: Income[]): number => {
  return incomes.reduce((sum, income) => 
    sum + calculateMonthlyAmount(income.amount, income.frequency), 0)
}

/**
 * Calcular despesas mensais totais
 */
export const calculateMonthlyExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => 
    sum + calculateMonthlyAmount(expense.amount, expense.frequency), 0)
}

/**
 * Calcular total de dívidas
 */
export const calculateTotalDebt = (debts: Debt[]): number => {
  return debts.reduce((sum, debt) => sum + debt.amount, 0)
}

/**
 * Calcular pagamentos mensais de dívidas
 */
export const calculateMonthlyDebtPayments = (debts: Debt[]): number => {
  return debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
}

/**
 * Calcular economia mensal líquida
 */
export const calculateMonthlySavings = (state: FinancialState): number => {
  const monthlyIncome = calculateMonthlyIncome(state.incomes)
  const monthlyExpenses = calculateMonthlyExpenses(state.expenses)
  const monthlyDebtPayments = calculateMonthlyDebtPayments(state.debts)
  
  return monthlyIncome - monthlyExpenses - monthlyDebtPayments
}

/**
 * Calcular patrimônio líquido
 */
export const calculateNetWorth = (state: FinancialState): number => {
  const totalAssets = calculateTotalBalance(state.accounts)
  const totalLiabilities = calculateTotalDebt(state.debts)
  
  return totalAssets - totalLiabilities
}

/**
 * Calcular taxa de poupança
 */
export const calculateSavingsRate = (state: FinancialState): number => {
  const monthlyIncome = calculateMonthlyIncome(state.incomes)
  const monthlySavings = calculateMonthlySavings(state)
  
  if (monthlyIncome === 0) return 0
  return (monthlySavings / monthlyIncome) * 100
}

/**
 * Calcular ratio dívida/patrimônio
 */
export const calculateDebtToAssetRatio = (state: FinancialState): number => {
  const totalAssets = calculateTotalBalance(state.accounts)
  const totalDebt = calculateTotalDebt(state.debts)
  
  if (totalAssets === 0) return totalDebt > 0 ? 100 : 0
  return (totalDebt / totalAssets) * 100
}

/**
 * Calcular meses de fundo de emergência
 */
export const calculateEmergencyFundMonths = (state: FinancialState): number => {
  const totalBalance = calculateTotalBalance(state.accounts)
  const monthlyExpenses = calculateMonthlyExpenses(state.expenses)
  
  if (monthlyExpenses === 0) return 0
  return totalBalance / monthlyExpenses
}

/**
 * Calcular saúde financeira geral
 */
export const calculateFinancialHealth = (state: FinancialState): FinancialHealthData => {
  const savingsRate = calculateSavingsRate(state)
  const debtToAssetRatio = calculateDebtToAssetRatio(state)
  const emergencyFundMonths = calculateEmergencyFundMonths(state)
  
  // Cálculo do score (0-100)
  let score = 0
  
  // Taxa de poupança (30 pontos)
  if (savingsRate >= 20) score += 30
  else if (savingsRate >= 10) score += 20
  else if (savingsRate >= 5) score += 10
  
  // Ratio de dívida (25 pontos)
  if (debtToAssetRatio <= 20) score += 25
  else if (debtToAssetRatio <= 40) score += 15
  else if (debtToAssetRatio <= 60) score += 5
  
  // Fundo de emergência (25 pontos)
  if (emergencyFundMonths >= 6) score += 25
  else if (emergencyFundMonths >= 3) score += 15
  else if (emergencyFundMonths >= 1) score += 5
  
  // Rendimento positivo (20 pontos)
  const monthlySavings = calculateMonthlySavings(state)
  if (monthlySavings > 0) score += 20
  else if (monthlySavings >= 0) score += 10
  
  // Status baseado no score
  let status = 'Crítica'
  if (score >= 80) status = 'Excelente'
  else if (score >= 60) status = 'Boa'
  else if (score >= 40) status = 'Razoável'
  else if (score >= 20) status = 'Atenção'
  
  return {
    score,
    status,
    savingsRate,
    debtToAssetRatio,
    emergencyFundMonths
  }
}