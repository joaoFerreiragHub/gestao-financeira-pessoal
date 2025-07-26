// src/types/expenses.ts

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetLimit?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseEntry {
  id: string;
  categoryId: string;
  categoryName: string; // Desnormalizado para performance
  amount: number;
  date: string; // YYYY-MM-DD format
  description?: string;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags?: string[];
  receipt?: string; // URL ou base64 da imagem do recibo
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'pix' | 'other';
  isEssential: boolean; // Despesa essencial ou supérflua
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseStats {
  totalThisMonth: number;
  totalLastMonth: number;
  totalThisYear: number;
  totalLastYear: number;
  averageMonthly: number;
  growth: {
    monthly: number;
    yearly: number;
  };
  byCategory: {
    categoryId: string;
    categoryName: string;
    total: number;
    percentage: number;
    budgetUsage?: number; // Percentual do orçamento usado
  }[];
  budgetStatus: {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
    percentageUsed: number;
  };
  essentialVsNonEssential: {
    essential: number;
    nonEssential: number;
    essentialPercentage: number;
  };
}

export interface ExpenseFilters {
  period: 'all' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';
  categories: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  search: string;
  tags?: string[];
  paymentMethods?: string[];
  isEssential?: boolean | null; // null = todas, true = essenciais, false = não essenciais
}

export type GroupByPeriod = 'day' | 'month' | 'year';

export interface GroupedExpenses {
  [key: string]: ExpenseEntry[];
}

// Formulário types
export interface ExpenseCategoryFormData {
  name: string;
  icon: string;
  color: string;
  budgetLimit: string;
  description: string;
  isActive: boolean;
}

export interface ExpenseEntryFormData {
  categoryId: string;
  amount: string;
  date: string;
  description: string;
  isRecurring: boolean;
  frequency: ExpenseEntry['frequency'];
  tags: string[];
  paymentMethod: ExpenseEntry['paymentMethod'];
  isEssential: boolean;
}

// Props types
export interface ExpenseComponentProps {
  showBalances: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Hook return types
export interface UseExpenseDataReturn {
  categories: ExpenseCategory[];
  entries: ExpenseEntry[];
  loading: boolean;
  addCategory: (category: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, updates: Partial<ExpenseCategory>) => void;
  deleteCategory: (id: string) => void;
  addEntry: (entry: Omit<ExpenseEntry, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<ExpenseEntry>) => void;
  deleteEntry: (id: string) => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

export interface UseExpenseStatsReturn {
  stats: ExpenseStats;
  recalculate: () => void;
}

export interface UseExpenseStorageReturn {
  saveData: (categories: ExpenseCategory[], entries: ExpenseEntry[]) => void;
  loadData: () => { categories: ExpenseCategory[]; entries: ExpenseEntry[] };
  clearData: () => void;
  exportToJSON: (categories: ExpenseCategory[], entries: ExpenseEntry[]) => string;
  importFromJSON: (jsonString: string) => { categories: ExpenseCategory[]; entries: ExpenseEntry[] } | null;
  getStorageInfo: () => {
    categoriesSize: number;
    entriesSize: number;
    backupSize: number;
    totalSize: number;
    itemCount: { categories: number; entries: number };
  };
}

// Categorias predefinidas
export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Alimentação', icon: '🍽️', color: 'orange' },
  { name: 'Transporte', icon: '🚗', color: 'blue' },
  { name: 'Habitação', icon: '🏠', color: 'green' },
  { name: 'Saúde', icon: '⚕️', color: 'red' },
  { name: 'Educação', icon: '📚', color: 'purple' },
  { name: 'Entretenimento', icon: '🎬', color: 'pink' },
  { name: 'Vestuário', icon: '👕', color: 'indigo' },
  { name: 'Tecnologia', icon: '💻', color: 'cyan' },
  { name: 'Seguros', icon: '🛡️', color: 'gray' },
  { name: 'Impostos', icon: '📄', color: 'yellow' },
  { name: 'Outros', icon: '📦', color: 'slate' }
] as const;