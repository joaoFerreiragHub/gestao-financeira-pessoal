import type { 
  Account, 
  Income, 
  Expense, 
  Debt, 
  FinancialState, 
  ProjectionData 
} from '../types/pageContext'

/**
 * Formatação de moeda em EUR
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Formatar percentagem
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Converter valor anual para mensal ou vice-versa
 */
export const calculateMonthlyAmount = (
  amount: number, 
  frequency: 'monthly' | 'yearly'
): number => {
  return frequency === 'yearly' ? amount / 12 : amount
}

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
 * Calcular despesas por categoria
 */
export const calculateExpensesByCategory = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    const monthlyAmount = calculateMonthlyAmount(expense.amount, expense.frequency)
    acc[expense.category] = (acc[expense.category] || 0) + monthlyAmount
    return acc
  }, {} as Record<string, number>)
}

/**
 * Simular pagamento de dívida com juros compostos
 */
export const simulateDebtPayment = (
  debt: Debt, 
  months: number
): { remainingDebt: number; totalInterestPaid: number; totalPaid: number } => {
  let remainingPrincipal = debt.amount
  let totalInterestPaid = 0
  let totalPaid = 0
  
  const monthlyInterestRate = debt.interestRate / 100 / 12
  
  for (let month = 0; month < months && remainingPrincipal > 0; month++) {
    const interestPayment = remainingPrincipal * monthlyInterestRate
    const principalPayment = Math.min(
      debt.monthlyPayment - interestPayment, 
      remainingPrincipal
    )
    
    if (principalPayment <= 0) break // Pagamento não cobre nem os juros
    
    remainingPrincipal -= principalPayment
    totalInterestPaid += interestPayment
    totalPaid += debt.monthlyPayment
  }
  
  return {
    remainingDebt: Math.max(0, remainingPrincipal),
    totalInterestPaid,
    totalPaid
  }
}

/**
 * Gerar projeções financeiras futuras
 */
export const generateProjections = (state: FinancialState, years: number = 15): ProjectionData[] => {
  const monthlyIncome = calculateMonthlyIncome(state.incomes)
  const monthlyExpenses = calculateMonthlyExpenses(state.expenses)
  const monthlyDebtPayments = calculateMonthlyDebtPayments(state.debts)
  const monthlySavings = monthlyIncome - monthlyExpenses - monthlyDebtPayments

  const currentNetWorth = calculateNetWorth(state)
  const currentTotalDebt = calculateTotalDebt(state.debts)

  const projections: ProjectionData[] = []

  for (let year = 1; year <= years; year++) {
    const months = year * 12

    // Simular redução de dívidas
    let projectedTotalDebt = 0
    state.debts.forEach(debt => {
      const simulation = simulateDebtPayment(debt, months)
      projectedTotalDebt += simulation.remainingDebt
    })

    const projectedSavings = monthlySavings * months
    const projectedNetWorth = currentNetWorth + projectedSavings

    projections.push({
      year,
      netWorth: projectedNetWorth,
      totalDebt: projectedTotalDebt,
      savings: projectedSavings,
      initialDebt: currentTotalDebt // <- comparação futura
    })
  }

  return projections
}


/**
 * Calcular tempo estimado para quitar dívidas
 */
export const calculateDebtPayoffTime = (debts: Debt[]): number => {
  if (debts.length === 0) return 0
  
  let maxMonths = 0
  
  for (const debt of debts) {
    const monthlyInterestRate = debt.interestRate / 100 / 12
    
    if (monthlyInterestRate === 0) {
      // Sem juros
      const months = debt.amount / debt.monthlyPayment
      maxMonths = Math.max(maxMonths, months)
    } else {
      // Com juros - fórmula de amortização
      const monthlyInterest = debt.amount * monthlyInterestRate
      if (debt.monthlyPayment <= monthlyInterest) {
        // Pagamento não cobre nem os juros - nunca quita
        return Infinity
      }
      
      const months = Math.log(1 + (debt.amount * monthlyInterestRate) / 
        (debt.monthlyPayment - debt.amount * monthlyInterestRate)) / 
        Math.log(1 + monthlyInterestRate)
      
      maxMonths = Math.max(maxMonths, months)
    }
  }
  
  return Math.ceil(maxMonths)
}

/**
 * Calcular indicadores de saúde financeira
 */
export const calculateFinancialHealth = (state: FinancialState) => {
  const netWorth = calculateNetWorth(state)
  const savingsRate = calculateSavingsRate(state)
  const debtToAssetRatio = calculateDebtToAssetRatio(state)
  const monthlySavings = calculateMonthlySavings(state)
  const emergencyFund = calculateTotalBalance(state.accounts.filter(a => a.type === 'savings'))
  const monthlyExpenses = calculateMonthlyExpenses(state.expenses)
  const emergencyFundMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0
  
  // Score de saúde financeira (0-100)
  let healthScore = 0
  
  // Patrimônio líquido positivo (25 pontos)
  if (netWorth > 0) healthScore += 25
  
  // Taxa de poupança boa (25 pontos)
  if (savingsRate >= 20) healthScore += 25
  else if (savingsRate >= 10) healthScore += 15
  else if (savingsRate >= 5) healthScore += 10
  
  // Baixo endividamento (25 pontos)
  if (debtToAssetRatio <= 30) healthScore += 25
  else if (debtToAssetRatio <= 50) healthScore += 15
  else if (debtToAssetRatio <= 70) healthScore += 10
  
  // Fundo de emergência (25 pontos)
  if (emergencyFundMonths >= 6) healthScore += 25
  else if (emergencyFundMonths >= 3) healthScore += 15
  else if (emergencyFundMonths >= 1) healthScore += 10
  
  return {
    score: healthScore,
    netWorth,
    savingsRate,
    debtToAssetRatio,
    monthlySavings,
    emergencyFundMonths,
    status: healthScore >= 80 ? 'Excelente' : 
            healthScore >= 60 ? 'Bom' : 
            healthScore >= 40 ? 'Regular' : 'Precisa Melhorar'
  }
}