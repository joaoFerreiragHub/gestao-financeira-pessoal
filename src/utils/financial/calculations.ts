// src/utils/financial/calculations.ts
import { FinancialState, Income, Expense, Debt, Account } from '../../types/financial';

/**
 * Converter valor para mensal baseado na frequência
 */
export const calculateMonthlyAmount = (
  amount: number, 
  frequency: 'monthly' | 'yearly' | 'weekly' | 'biweekly' | 'one-time'
): number => {
  switch (frequency) {
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    case 'weekly':
      return amount * 4.33; // ~52 semanas / 12 meses
    case 'biweekly':
      return amount * 2.17; // ~26 períodos / 12 meses
    case 'one-time':
      return 0; // Não conta para cálculos mensais regulares
    default:
      return amount;
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
    case 'monthly':
      return amount * 12;
    case 'yearly':
      return amount;
    case 'weekly':
      return amount * 52;
    case 'biweekly':
      return amount * 26;
    case 'one-time':
      return amount;
    default:
      return amount * 12;
  }
};

/**
 * Calcular total de saldos das contas
 */
export const calculateTotalBalance = (accounts: Account[]): number => {
  return accounts
    .filter(account => account.isActive)
    .reduce((sum, account) => {
      // Contas de crédito e empréstimos são passivos (valores negativos)
      if (account.type === 'credit' || account.type === 'loan') {
        return sum - Math.abs(account.balance);
      }
      return sum + account.balance;
    }, 0);
};

/**
 * Calcular rendimento mensal total
 */
export const calculateMonthlyIncome = (incomes: Income[]): number => {
  return incomes
    .filter(income => income.isActive)
    .reduce((sum, income) => 
      sum + calculateMonthlyAmount(income.amount, income.frequency), 0);
};

/**
 * Calcular despesas mensais totais
 */
export const calculateMonthlyExpenses = (expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.isActive)
    .reduce((sum, expense) => 
      sum + calculateMonthlyAmount(expense.amount, expense.frequency), 0);
};

/**
 * Calcular despesas fixas mensais
 */
export const calculateMonthlyFixedExpenses = (expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.isActive && expense.type === 'fixed')
    .reduce((sum, expense) => 
      sum + calculateMonthlyAmount(expense.amount, expense.frequency), 0);
};

/**
 * Calcular despesas variáveis mensais
 */
export const calculateMonthlyVariableExpenses = (expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.isActive && expense.type === 'variable')
    .reduce((sum, expense) => 
      sum + calculateMonthlyAmount(expense.amount, expense.frequency), 0);
};

/**
 * Calcular total de dívidas
 */
export const calculateTotalDebt = (debts: Debt[]): number => {
  return debts
    .filter(debt => debt.isActive)
    .reduce((sum, debt) => sum + debt.remainingAmount, 0);
};

/**
 * Calcular pagamentos mensais de dívidas
 */
export const calculateMonthlyDebtPayments = (debts: Debt[]): number => {
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
  const totalAssets = calculateTotalBalance(state.accounts.filter(a => 
    a.type !== 'credit' && a.type !== 'loan'
  ));
  const totalLiabilities = calculateTotalDebt(state.debts) + 
    Math.abs(calculateTotalBalance(state.accounts.filter(a => 
      a.type === 'credit' || a.type === 'loan'
    )));
  
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
 * Calcular ratio dívida/rendimento
 */
export const calculateDebtToIncomeRatio = (state: FinancialState): number => {
  const monthlyIncome = calculateMonthlyIncome(state.incomes);
  const monthlyDebtPayments = calculateMonthlyDebtPayments(state.debts);
  
  if (monthlyIncome === 0) return 0;
  return (monthlyDebtPayments / monthlyIncome) * 100;
};

/**
 * Calcular ratio despesas/rendimento
 */
export const calculateExpenseToIncomeRatio = (state: FinancialState): number => {
  const monthlyIncome = calculateMonthlyIncome(state.incomes);
  const monthlyExpenses = calculateMonthlyExpenses(state.expenses);
  
  if (monthlyIncome === 0) return 0;
  return (monthlyExpenses / monthlyIncome) * 100;
};

/**
 * Calcular meses para quitar dívida
 */
export const calculateMonthsToPayOffDebt = (
  remainingAmount: number,
  monthlyPayment: number,
  interestRate: number
): number => {
  if (monthlyPayment <= 0) return Infinity;
  
  const monthlyInterestRate = interestRate / 100 / 12;
  
  // Se não há juros, é simples divisão
  if (monthlyInterestRate === 0) {
    return Math.ceil(remainingAmount / monthlyPayment);
  }
  
  // Fórmula para empréstimos com juros compostos
  const numerator = Math.log(1 + (remainingAmount * monthlyInterestRate) / monthlyPayment);
  const denominator = Math.log(1 + monthlyInterestRate);
  
  return Math.ceil(numerator / denominator);
};

/**
 * Calcular total de juros a pagar
 */
export const calculateTotalInterest = (
  remainingAmount: number,
  monthlyPayment: number,
  interestRate: number
): number => {
  const months = calculateMonthsToPayOffDebt(remainingAmount, monthlyPayment, interestRate);
  
  if (months === Infinity) return 0;
  
  const totalPaid = monthlyPayment * months;
  return Math.max(0, totalPaid - remainingAmount);
};

// src/utils/financial/formatters.ts
/**
 * Formatar valores monetários
 */
export const formatCurrency = (
  value: number,
  currency: string = 'EUR',
  locale: string = 'pt-PT'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formatar percentagens
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  locale: string = 'pt-PT'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Formatar números grandes com sufixos
 */
export const formatLargeNumber = (
  value: number,
  locale: string = 'pt-PT'
): string => {
  const absValue = Math.abs(value);
  
  if (absValue >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  } else if (absValue >= 1_000) {
    return (value / 1_000).toFixed(1) + 'k';
  }
  
  return value.toString();
};

/**
 * Formatar datas de forma amigável
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium',
  locale: string = 'pt-PT'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' }
  };
  
  return new Intl.DateTimeFormat(locale, options[format]).format(dateObj);
};

/**
 * Formatar período relativo (ex: "há 2 dias")
 */
export const formatRelativeTime = (
  date: string | Date,
  locale: string = 'pt-PT'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = (now.getTime() - dateObj.getTime()) / 1000;
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-Math.floor(diffInSeconds), 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};

/**
 * Ocultar valores sensíveis
 */
export const hideValue = (
  value: string | number,
  showValue: boolean,
  placeholder: string = '••••••'
): string => {
  if (showValue) {
    return typeof value === 'number' ? formatCurrency(value) : value.toString();
  }
  return placeholder;
};

/**
 * Validar e formatar entrada de valor monetário
 */
export const parseMonetaryInput = (input: string): number => {
  // Remove tudo exceto números, vírgulas e pontos
  const cleaned = input.replace(/[^\d.,]/g, '');
  
  // Converte vírgula para ponto (padrão português)
  const normalized = cleaned.replace(',', '.');
  
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};