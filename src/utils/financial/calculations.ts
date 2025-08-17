// src/utils/financial/calculations.ts
// ✅ CÁLCULOS FINANCEIROS CONSOLIDADOS

import { FinancialState, EmergencyFund, EmergencyPlan } from '../../types/financial';

/**
 * Converter valor para mensal baseado na frequência
 */
export const calculateMonthlyAmount = (
  amount: number, 
  frequency: 'monthly' | 'yearly' | 'weekly' | 'biweekly' | 'one-time'
): number => {
  switch (frequency) {
    case 'monthly': return amount;
    case 'yearly': return amount / 12;
    case 'weekly': return amount * 4.33; // 52 semanas / 12 meses
    case 'biweekly': return amount * 2.17; // 26 quinzenas / 12 meses
    case 'one-time': return 0; // Não conta para cálculos mensais
    default: return amount;
  }
};

/**
 * Converter valor para anual baseado na frequência
 */
export const calculateYearlyAmount = (
  amount: number, 
  frequency: 'monthly' | 'yearly' | 'weekly' | 'biweekly' | 'one-time'
): number => {
  switch (frequency) {
    case 'monthly': return amount * 12;
    case 'yearly': return amount;
    case 'weekly': return amount * 52;
    case 'biweekly': return amount * 26;
    case 'one-time': return amount; // Valor único
    default: return amount;
  }
};

/**
 * Calcular total de saldos das contas
 */
export const calculateTotalBalance = (accounts: FinancialState['accounts']): number => {
  return accounts
    .filter(account => account.isActive)
    .reduce((sum, account) => sum + account.balance, 0);
};

/**
 * Calcular rendimento mensal total
 */
export const calculateMonthlyIncome = (incomes: FinancialState['incomes']): number => {
  return incomes
    .filter(income => income.isActive)
    .reduce((sum, income) => 
      sum + calculateMonthlyAmount(income.amount, income.frequency), 0);
};

/**
 * Calcular despesas mensais totais
 */
export const calculateMonthlyExpenses = (expenses: FinancialState['expenses']): number => {
  return expenses
    .filter(expense => expense.isActive)
    .reduce((sum, expense) => 
      sum + calculateMonthlyAmount(expense.amount, expense.frequency), 0);
};

/**
 * Calcular total de dívidas
 */
export const calculateTotalDebt = (debts: FinancialState['debts']): number => {
  return debts
    .filter(debt => debt.isActive)
    .reduce((sum, debt) => sum + debt.remainingAmount, 0);
};

/**
 * Calcular pagamentos mensais de dívidas
 */
export const calculateMonthlyDebtPayments = (debts: FinancialState['debts']): number => {
  return debts
    .filter(debt => debt.isActive)
    .reduce((sum, debt) => sum + debt.monthlyPayment, 0);
};

/**
 * Calcular economia mensal líquida
 */
export const calculateMonthlySavings = (state: FinancialState): number => {
  const monthlyIncome = calculateMonthlyIncome(state.incomes);
  const monthlyExpenses = calculateMonthlyExpenses(state.expenses);
  const monthlyDebtPayments = calculateMonthlyDebtPayments(state.debts);
  
  return monthlyIncome - monthlyExpenses - monthlyDebtPayments;
};

/**
 * Calcular patrimônio líquido
 */
export const calculateNetWorth = (state: FinancialState): number => {
  const totalAssets = calculateTotalBalance(state.accounts);
  const totalLiabilities = calculateTotalDebt(state.debts);
  
  return totalAssets - totalLiabilities;
};

/**
 * Calcular taxa de poupança
 */
export const calculateSavingsRate = (state: FinancialState): number => {
  const monthlyIncome = calculateMonthlyIncome(state.incomes);
  const monthlySavings = calculateMonthlySavings(state);
  
  if (monthlyIncome === 0) return 0;
  return (monthlySavings / monthlyIncome) * 100;
};

/**
 * Calcular ratio dívida/patrimônio
 */
export const calculateDebtToAssetRatio = (state: FinancialState): number => {
  const totalAssets = calculateTotalBalance(state.accounts);
  const totalDebt = calculateTotalDebt(state.debts);
  
  if (totalAssets === 0) return totalDebt > 0 ? 100 : 0;
  return (totalDebt / totalAssets) * 100;
};

/**
 * Calcular meses de fundo de emergência
 */
export const calculateEmergencyFundMonths = (state: FinancialState): number => {
  const totalBalance = state.emergencyFund?.currentAmount || 0;
  const monthlyExpenses = calculateMonthlyExpenses(state.expenses);
  
  if (monthlyExpenses === 0) return 0;
  return totalBalance / monthlyExpenses;
};

// ===== CÁLCULOS ESPECÍFICOS DO FUNDO DE EMERGÊNCIA =====

export interface EmergencyFundMetrics {
  targetAmount: number;
  progressPercentage: number;
  remaining: number;
  currentMonths: number;
  monthsToComplete: number;
  isComplete: boolean;
}

/**
 * Calcular métricas do fundo de emergência
 */
export const calculateEmergencyFundMetrics = (
  data: { monthlyExpenses: number; currentEmergencyFund: number },
  plan: EmergencyPlan,
  monthlyContribution: number = 0
): EmergencyFundMetrics => {
  const targetAmount = data.monthlyExpenses * plan.months;
  const progressPercentage = targetAmount > 0 ? (data.currentEmergencyFund / targetAmount) * 100 : 0;
  const remaining = Math.max(0, targetAmount - data.currentEmergencyFund);
  const currentMonths = data.monthlyExpenses > 0 ? data.currentEmergencyFund / data.monthlyExpenses : 0;
  const monthsToComplete = monthlyContribution > 0 ? Math.ceil(remaining / monthlyContribution) : 0;
  const isComplete = progressPercentage >= 100;

  return {
    targetAmount,
    progressPercentage,
    remaining,
    currentMonths,
    monthsToComplete,
    isComplete
  };
};

/**
 * Calcular saúde financeira geral
 */
export const calculateFinancialHealth = (state: FinancialState) => {
  const savingsRate = calculateSavingsRate(state);
  const debtToAssetRatio = calculateDebtToAssetRatio(state);
  const emergencyFundMonths = calculateEmergencyFundMonths(state);
  
  // Cálculo do score (0-100)
  let score = 0;
  
  // Taxa de poupança (30 pontos)
  if (savingsRate >= 20) score += 30;
  else if (savingsRate >= 10) score += 20;
  else if (savingsRate >= 5) score += 10;
  
  // Ratio de dívida (25 pontos)
  if (debtToAssetRatio <= 20) score += 25;
  else if (debtToAssetRatio <= 40) score += 15;
  else if (debtToAssetRatio <= 60) score += 5;
  
  // Fundo de emergência (25 pontos)
  if (emergencyFundMonths >= 6) score += 25;
  else if (emergencyFundMonths >= 3) score += 15;
  else if (emergencyFundMonths >= 1) score += 5;
  
  // Rendimento positivo (20 pontos)
  const monthlySavings = calculateMonthlySavings(state);
  if (monthlySavings > 0) score += 20;
  else if (monthlySavings >= 0) score += 10;
  
  // Status baseado no score
  let status = 'Crítica';
  const recommendations: string[] = [];
  
  if (score >= 80) {
    status = 'Excelente';
    recommendations.push('Continue mantendo este excelente desempenho financeiro!');
  } else if (score >= 60) {
    status = 'Boa';
    recommendations.push('Sua situação financeira está boa, mas há espaço para melhorias.');
  } else if (score >= 40) {
    status = 'Razoável';
    recommendations.push('Considere aumentar sua taxa de poupança.');
    if (emergencyFundMonths < 3) {
      recommendations.push('Priorize a construção do seu fundo de emergência.');
    }
  } else if (score >= 20) {
    status = 'Atenção';
    recommendations.push('Sua situação financeira precisa de atenção urgente.');
    recommendations.push('Revise seus gastos e tente aumentar sua poupança.');
  } else {
    recommendations.push('Situação crítica: busque ajuda financeira profissional.');
    recommendations.push('Foque em reduzir despesas e eliminar dívidas.');
  }
  
  return {
    score,
    status,
    savingsRate,
    debtToAssetRatio,
    emergencyFundMonths,
    recommendations
  };
};