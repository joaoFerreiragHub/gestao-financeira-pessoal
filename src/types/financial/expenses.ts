// src/types/financial/expenses.ts
export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  type: 'fixed' | 'variable' | 'debt';
  isActive: boolean;
  description?: string;
  parentId?: string; // Para subcategorias
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  date: string;
  type: 'fixed' | 'variable';
  isRecurring: boolean;
  recurringConfig?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    dayOfMonth?: number;
    dayOfWeek?: number;
    endDate?: string;
  };
  debtId?: string; // Referência para dívida relacionada
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  fixedExpenses: number;
  variableExpenses: number;
  debtPayments: number;
  averageMonthly: number;
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }[];
  monthlyTrend: {
    month: string;
    amount: number;
  }[];
  budgetVsActual: {
    categoryId: string;
    budgeted: number;
    actual: number;
    variance: number;
  }[];
}

export interface DebtExpenseSync {
  debtId: string;
  expenseId: string;
  amount: number;
  isAutomatic: boolean;
  syncedAt: string;
}

// Hooks interfaces
export interface UseExpenseDataReturn {
  categories: ExpenseCategory[];
  entries: ExpenseEntry[];
  stats: ExpenseStats;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addCategory: (category: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, updates: Partial<ExpenseCategory>) => void;
  deleteCategory: (id: string) => void;
  
  addEntry: (entry: Omit<ExpenseEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<ExpenseEntry>) => void;
  deleteEntry: (id: string) => void;
  
  // Utilities
  getCategoryExpenses: (categoryId: string) => ExpenseEntry[];
  getFixedExpenses: () => ExpenseEntry[];
  getVariableExpenses: () => ExpenseEntry[];
  getDebtExpenses: () => ExpenseEntry[];
  
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearAllData: () => void;
}

// Default categories
export const DEFAULT_EXPENSE_CATEGORIES: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Despesas Fixas
  { name: 'Habitação', icon: '🏠', color: 'bg-blue-500', budget: 0, type: 'fixed', isActive: true, description: 'Renda, financiamento, condomínio' },
  { name: 'Transportes', icon: '🚗', color: 'bg-green-500', budget: 0, type: 'fixed', isActive: true, description: 'Combustível, seguros, manutenção' },
  { name: 'Seguros', icon: '🛡️', color: 'bg-purple-500', budget: 0, type: 'fixed', isActive: true, description: 'Saúde, vida, automóvel' },
  { name: 'Subscrições', icon: '📱', color: 'bg-indigo-500', budget: 0, type: 'fixed', isActive: true, description: 'Streaming, software, ginásio' },
  
  // Despesas Variáveis
  { name: 'Alimentação', icon: '🍽️', color: 'bg-orange-500', budget: 0, type: 'variable', isActive: true, description: 'Supermercado, restaurantes' },
  { name: 'Saúde', icon: '⚕️', color: 'bg-red-500', budget: 0, type: 'variable', isActive: true, description: 'Médicos, medicamentos, exames' },
  { name: 'Lazer', icon: '🎉', color: 'bg-pink-500', budget: 0, type: 'variable', isActive: true, description: 'Cinema, viagens, hobbies' },
  { name: 'Vestuário', icon: '👕', color: 'bg-cyan-500', budget: 0, type: 'variable', isActive: true, description: 'Roupa, calçado, acessórios' },
  { name: 'Educação', icon: '📚', color: 'bg-yellow-500', budget: 0, type: 'variable', isActive: true, description: 'Cursos, livros, formação' },
  
  // Categoria especial para dívidas
  { name: 'Dívidas', icon: '💳', color: 'bg-red-600', budget: 0, type: 'debt', isActive: true, description: 'Pagamentos de empréstimos e financiamentos' }
];