// src/types/financial/index.ts
export * from './core';
export * from './expenses';
export * from './emergencyFund';

// src/types/financial/core.ts
export interface FinancialState {
  accounts: Account[];
  incomes: Income[];
  expenses: Expense[];
  debts: Debt[];
  emergencyFund: EmergencyFund | null;
  goals: FinancialGoal[];
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  balance: number;
  currency: string;
  institution?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly' | 'biweekly';
  category: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly' | 'one-time';
  category: string;
  categoryId: string;
  type: 'fixed' | 'variable';
  isActive: boolean;
  dueDate?: string;
  debtId?: string; // Ligação com dívidas
  createdAt: string;
  updatedAt: string;
}

export interface Debt {
  id: string;
  name: string;
  type: 'credit_card' | 'loan' | 'mortgage' | 'student_loan' | 'other';
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}