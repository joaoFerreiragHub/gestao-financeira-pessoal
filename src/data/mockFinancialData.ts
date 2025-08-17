// src/data/mockFinancialData.ts
// ✅ DADOS MOCK CENTRALIZADOS PARA TODA A APLICAÇÃO

import { FinancialState, Account, Income, Expense, Debt, FinancialGoal } from '../types/financial';
import { EmergencyFund, EmergencyPlan } from '../types/emergencyFund';

// ===== CONTAS BANCÁRIAS =====
export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'Conta Ordenado',
    type: 'checking',
    balance: 2847.50,
    currency: 'EUR',
    institution: 'Millennium BCP',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'acc-2',
    name: 'Conta Poupança',
    type: 'savings',
    balance: 15420.75,
    currency: 'EUR',
    institution: 'Caixa Geral de Depósitos',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'acc-3',
    name: 'Conta Investimentos',
    type: 'investment',
    balance: 8750.25,
    currency: 'EUR',
    institution: 'XTB',
    isActive: true,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'acc-4',
    name: 'Cartão de Crédito',
    type: 'credit',
    balance: -1234.80,
    currency: 'EUR',
    institution: 'Santander',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  }
];

// ===== RENDIMENTOS =====
export const MOCK_INCOMES: Income[] = [
  {
    id: 'inc-1',
    source: 'Salário Principal',
    amount: 2800.00,
    frequency: 'monthly',
    category: 'Trabalho',
    isActive: true,
    startDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'inc-2',
    source: 'Freelancing',
    amount: 500.00,
    frequency: 'monthly',
    category: 'Trabalho Extra',
    isActive: true,
    startDate: '2024-03-01',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'inc-3',
    source: 'Subsídio de Natal',
    amount: 2800.00,
    frequency: 'yearly',
    category: 'Bónus',
    isActive: true,
    startDate: '2024-12-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  }
];

// ===== DESPESAS =====
export const MOCK_EXPENSES: Expense[] = [
  // Despesas Fixas
  {
    id: 'exp-1',
    description: 'Renda de Casa',
    amount: 750.00,
    frequency: 'monthly',
    category: 'Habitação',
    categoryId: 'cat-housing',
    type: 'fixed',
    isActive: true,
    dueDate: '2025-01-05',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'exp-2',
    description: 'Seguro Automóvel',
    amount: 65.00,
    frequency: 'monthly',
    category: 'Transportes',
    categoryId: 'cat-transport',
    type: 'fixed',
    isActive: true,
    dueDate: '2025-01-15',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'exp-3',
    description: 'Netflix + Spotify',
    amount: 25.00,
    frequency: 'monthly',
    category: 'Subscrições',
    categoryId: 'cat-subscriptions',
    type: 'fixed',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  // Despesas Variáveis
  {
    id: 'exp-4',
    description: 'Supermercado',
    amount: 320.00,
    frequency: 'monthly',
    category: 'Alimentação',
    categoryId: 'cat-food',
    type: 'variable',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'exp-5',
    description: 'Combustível',
    amount: 180.00,
    frequency: 'monthly',
    category: 'Transportes',
    categoryId: 'cat-transport',
    type: 'variable',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'exp-6',
    description: 'Lazer e Entretenimento',
    amount: 150.00,
    frequency: 'monthly',
    category: 'Lazer',
    categoryId: 'cat-entertainment',
    type: 'variable',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  }
];

// ===== DÍVIDAS =====
export const MOCK_DEBTS: Debt[] = [
  {
    id: 'debt-1',
    name: 'Crédito Automóvel',
    type: 'loan',
    totalAmount: 25000.00,
    remainingAmount: 18750.00,
    monthlyPayment: 385.50,
    interestRate: 4.2,
    startDate: '2023-06-01',
    endDate: '2028-05-31',
    isActive: true,
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'debt-2',
    name: 'Cartão de Crédito',
    type: 'credit_card',
    totalAmount: 5000.00,
    remainingAmount: 1234.80,
    monthlyPayment: 150.00,
    interestRate: 18.9,
    startDate: '2024-02-01',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  }
];

// ===== METAS FINANCEIRAS =====
export const MOCK_GOALS: FinancialGoal[] = [
  {
    id: 'goal-1',
    title: 'Fundo de Emergência',
    description: 'Acumular 6 meses de despesas para emergências',
    targetAmount: 8280.00,
    currentAmount: 4500.00,
    targetDate: '2025-06-30',
    priority: 'high',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'goal-2',
    title: 'Viagem para o Japão',
    description: 'Poupança para viagem de 2 semanas ao Japão',
    targetAmount: 4000.00,
    currentAmount: 1200.00,
    targetDate: '2025-10-01',
    priority: 'medium',
    status: 'active',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'goal-3',
    title: 'Entrada para Apartamento',
    description: 'Poupança para entrada de 20% para apartamento próprio',
    targetAmount: 40000.00,
    currentAmount: 15420.75,
    targetDate: '2026-12-31',
    priority: 'high',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'goal-4',
    title: 'Carro Novo',
    description: 'Troca do carro atual por um modelo mais recente',
    targetAmount: 15000.00,
    currentAmount: 3750.00,
    targetDate: '2025-08-31',
    priority: 'medium',
    status: 'active',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-12-21T10:30:00Z'
  },
  {
    id: 'goal-5',
    title: 'Curso de Especialização',
    description: 'Formação avançada em desenvolvimento de software',
    targetAmount: 2500.00,
    currentAmount: 2500.00,
    targetDate: '2024-12-01',
    priority: 'high',
    status: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];

// ===== FUNDO DE EMERGÊNCIA =====
export const MOCK_EMERGENCY_FUND: EmergencyFund = {
  id: 'ef-1',
  currentAmount: 4500.00,
  targetAmount: 8280.00,
  monthlyExpenses: 1380.00,
  targetMonths: 6,
  isActive: true,
  lastUpdated: '2024-12-21T10:30:00Z',
  autoContribution: {
    enabled: true,
    amount: 300.00,
    frequency: 'monthly',
    nextContribution: '2025-01-01T00:00:00Z'
  }
};

export const MOCK_EMERGENCY_PLANS: EmergencyPlan[] = [
  {
    id: 'plan-conservative',
    name: 'Conservador',
    months: 6,
    description: 'Recomendado para a maioria das pessoas',
    riskLevel: 'low'
  },
  {
    id: 'plan-moderate',
    name: 'Moderado',
    months: 4,
    description: 'Para quem tem rendimento estável',
    riskLevel: 'medium'
  },
  {
    id: 'plan-aggressive',
    name: 'Agressivo',
    months: 3,
    description: 'Para quem tem múltiplas fontes de rendimento',
    riskLevel: 'high'
  }
];

// ===== ESTADO FINANCEIRO CONSOLIDADO =====
export const MOCK_FINANCIAL_STATE: FinancialState = {
  accounts: MOCK_ACCOUNTS,
  incomes: MOCK_INCOMES,
  expenses: MOCK_EXPENSES,
  debts: MOCK_DEBTS,
  emergencyFund: MOCK_EMERGENCY_FUND,
  goals: MOCK_GOALS
};

// ===== DADOS PARA DASHBOARD =====
export const MOCK_DASHBOARD_DATA = {
  patrimonio: 25783.70, // Total de ativos - passivos
  receitas: 3300.00,    // Rendimento mensal total
  despesas: 1380.00,    // Despesas mensais totais
  poupanca: 1500.00,    // Poupança mensal líquida
  taxaPoupanca: 45.5,   // Taxa de poupança (%)
  ratioGastos: 41.8,    // Ratio de despesas (%)
  variacao: {
    patrimonio: 4.1,
    receitas: 3.2,
    despesas: -2.1,
    poupanca: 8.7
  }
};

// ===== DADOS DE CATEGORIAS PARA GRÁFICOS =====
export const MOCK_CATEGORY_DATA = [
  { name: 'Habitação', value: 750, percentage: 54.3, color: 'bg-blue-500' },
  { name: 'Alimentação', value: 320, percentage: 23.2, color: 'bg-emerald-500' },
  { name: 'Transportes', value: 245, percentage: 17.8, color: 'bg-amber-500' },
  { name: 'Subscrições', value: 25, percentage: 1.8, color: 'bg-purple-500' },
  { name: 'Lazer', value: 150, percentage: 10.9, color: 'bg-pink-500' }
];

// ===== TRANSAÇÕES RECENTES =====
export const MOCK_RECENT_TRANSACTIONS = [
  { 
    id: 'trans-1',
    type: 'expense' as const, 
    category: 'Alimentação', 
    amount: -45.60, 
    date: 'Hoje', 
    time: '14:30',
    description: 'Supermercado Continente'
  },
  { 
    id: 'trans-2',
    type: 'income' as const, 
    category: 'Salário', 
    amount: 2800.00, 
    date: 'Ontem', 
    time: '09:00',
    description: 'Transferência bancária'
  },
  { 
    id: 'trans-3',
    type: 'expense' as const, 
    category: 'Transporte', 
    amount: -12.80, 
    date: '2 dias', 
    time: '08:15',
    description: 'Combustível BP'
  },
  { 
    id: 'trans-4',
    type: 'expense' as const, 
    category: 'Entretenimento', 
    amount: -35.00, 
    date: '3 dias', 
    time: '19:45',
    description: 'Cinema UCI'
  }
];

export default MOCK_FINANCIAL_STATE;
