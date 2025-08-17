// src/types/financial/core.ts
// ✅ TIPOS FUNDAMENTAIS CONSOLIDADOS

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

// ===== TIPOS PARA FUNDO DE EMERGÊNCIA =====
export interface EmergencyFund {
  id: string;
  currentAmount: number;
  targetAmount: number;
  monthlyExpenses: number;
  targetMonths: number;
  isActive: boolean;
  lastUpdated: string;
  autoContribution?: {
    enabled: boolean;
    amount: number;
    frequency: 'weekly' | 'monthly';
    nextContribution: string;
  };
}

export interface EmergencyPlan {
  id: string;
  name: string;
  months: number;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// ===== TIPOS PARA CÁLCULOS =====
export interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netWorth: number;
  monthlySavings: number;
  savingsRate: number;
  debtToAssetRatio: number;
  emergencyFundMonths: number;
}

export interface FinancialHealthData {
  score: number;
  status: string;
  savingsRate: number;
  debtToAssetRatio: number;
  emergencyFundMonths: number;
  recommendations: string[];
}

// ===== TIPOS PARA COMPONENTES =====
export interface User {
  name: string;
  email: string;
  avatar: string;
  plan: string;
}

export interface MetricsData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netWorth: number;
  monthlySavings: number;
}

export interface QuickActionsData {
  accountsCount: number;
  incomesCount: number;
  expensesCount: number;
  debtsCount: number;
}

// ===== PROPS DOS COMPONENTES =====
export interface FinancialHealthCardProps {
  healthData: FinancialHealthData;
  showValues?: boolean;
}

export interface MetricGridProps {
  financialData: MetricsData;
  showBalances: boolean;
  onToggleBalances: () => void;
  loading?: boolean;
}

export interface QuickActionsProps {
  onNavigate: (section: string) => void;
  financialData?: QuickActionsData;
}

export interface EnhancedSidebarProps {
  user?: User;
  financialSummary?: FinancialSummary;
  activeSection: string;
  onSectionChange?: (section: string) => void;
  onLogout?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ===== TOAST TYPES =====
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}
