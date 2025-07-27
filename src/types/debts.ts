// src/types/debts.ts

export interface DebtCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DebtEntry {
  id: string;
  categoryId: string;
  categoryName: string; // Desnormalizado para performance
  creditorName: string; // Nome do credor (banco, instituição, pessoa)
  originalAmount: number; // Valor original da dívida
  currentBalance: number; // Saldo atual devedor
  interestRate: number; // Taxa de juro anual (%)
  monthlyPayment: number; // Pagamento mensal
  minimumPayment?: number; // Pagamento mínimo (para cartões)
  dueDate: string; // Data de vencimento (YYYY-MM-DD)
  startDate: string; // Data de início da dívida
  endDate?: string; // Data estimada de quitação
  description?: string;
  isActive: boolean; // Se a dívida ainda está ativa
  priority: 'high' | 'medium' | 'low'; // Prioridade de pagamento
  debtType: 'fixed' | 'revolving' | 'installment'; // Tipo de dívida
  tags?: string[];
  collateral?: string; // Garantia (para empréstimos)
  createdAt: string;
  updatedAt: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentType: 'principal' | 'interest' | 'mixed'; // Tipo de pagamento
  principalAmount: number; // Valor aplicado ao principal
  interestAmount: number; // Valor de juros
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DebtStats {
  totalDebt: number;
  totalMonthlyPayments: number;
  totalInterestPaid: number; // Juros pagos este ano
  totalPrincipalPaid: number; // Principal pago este ano
  averageInterestRate: number;
  debtToIncomeRatio: number; // Razão dívida/renda
  payoffProjection: {
    months: number;
    totalInterest: number;
    payoffDate: string;
  };
  byCategory: {
    categoryId: string;
    categoryName: string;
    totalDebt: number;
    monthlyPayment: number;
    percentage: number;
    averageRate: number;
  }[];
  byPriority: {
    high: { count: number; totalDebt: number; monthlyPayment: number };
    medium: { count: number; totalDebt: number; monthlyPayment: number };
    low: { count: number; totalDebt: number; monthlyPayment: number };
  };
  debtFreeDate: string; // Data estimada para ficar livre de dívidas
}

export interface DebtFilters {
  period: 'all' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';
  categories: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min?: number;
    max?: number;
  };
  search: string;
  tags?: string[];
  priority?: ('high' | 'medium' | 'low')[];
  debtType?: ('fixed' | 'revolving' | 'installment')[];
  isActive?: boolean | null; // null = todas, true = ativas, false = quitadas
}

export type GroupByPeriod = 'day' | 'month' | 'year';

export interface GroupedDebts {
  [key: string]: DebtEntry[];
}

// Formulário types
export interface DebtCategoryFormData {
  name: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
}

export interface DebtEntryFormData {
  categoryId: string;
  creditorName: string;
  originalAmount: string;
  currentBalance: string;
  interestRate: string;
  monthlyPayment: string;
  minimumPayment: string;
  dueDate: string;
  startDate: string;
  description: string;
  priority: DebtEntry['priority'];
  debtType: DebtEntry['debtType'];
  tags: string[];
  collateral: string;
  isActive: boolean;
}

export interface DebtPaymentFormData {
  debtId: string;
  amount: string;
  date: string;
  paymentType: DebtPayment['paymentType'];
  description: string;
}

// Props types
export interface DebtComponentProps {
  showBalances: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Hook return types
export interface UseDebtDataReturn {
  categories: DebtCategory[];
  debts: DebtEntry[];
  payments: DebtPayment[];
  loading: boolean;
  addCategory: (category: Omit<DebtCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, updates: Partial<DebtCategory>) => void;
  deleteCategory: (id: string) => void;
  addDebt: (debt: Omit<DebtEntry, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>) => void;
  updateDebt: (id: string, updates: Partial<DebtEntry>) => void;
  deleteDebt: (id: string) => void;
  addPayment: (payment: Omit<DebtPayment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePayment: (id: string, updates: Partial<DebtPayment>) => void;
  deletePayment: (id: string) => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

export interface UseDebtStatsReturn {
  stats: DebtStats;
  recalculate: () => void;
}

// Categorias predefinidas para dívidas
export const DEFAULT_DEBT_CATEGORIES = [
  { name: 'Empréstimo Pessoal', icon: '🏦', color: 'blue' },
  { name: 'Cartão de Crédito', icon: '💳', color: 'red' },
  { name: 'Financiamento Imobiliário', icon: '🏠', color: 'green' },
  { name: 'Financiamento Automóvel', icon: '🚗', color: 'orange' },
  { name: 'Empréstimo Estudantil', icon: '📚', color: 'purple' },
  { name: 'Crédito Empresarial', icon: '🏢', color: 'indigo' },
  { name: 'Empréstimo Familiar', icon: '👨‍👩‍👧‍👦', color: 'pink' },
  { name: 'Financiamento Equipamentos', icon: '💻', color: 'cyan' },
  { name: 'Descoberto Bancário', icon: '📊', color: 'yellow' },
  { name: 'Outros', icon: '📄', color: 'gray' }
] as const;

// Estratégias de pagamento
export type PaymentStrategy = 'avalanche' | 'snowball' | 'minimum' | 'custom';

export interface PaymentStrategyInfo {
  id: PaymentStrategy;
  name: string;
  description: string;
  icon: string;
  benefits: string[];
  whenToUse: string;
}

export const PAYMENT_STRATEGIES: PaymentStrategyInfo[] = [
  {
    id: 'avalanche',
    name: 'Método Avalanche',
    description: 'Pagar primeiro as dívidas com maior taxa de juro',
    icon: '⛰️',
    benefits: ['Menor custo total com juros', 'Pagamento mais rápido matematicamente'],
    whenToUse: 'Quando quer minimizar o total de juros pagos'
  },
  {
    id: 'snowball',
    name: 'Método Snowball',
    description: 'Pagar primeiro as dívidas com menor saldo',
    icon: '⛄',
    benefits: ['Motivação psicológica', 'Sucessos rápidos'],
    whenToUse: 'Quando precisa de motivação e vitórias rápidas'
  },
  {
    id: 'minimum',
    name: 'Pagamentos Mínimos',
    description: 'Pagar apenas o mínimo de cada dívida',
    icon: '🔄',
    benefits: ['Menor impacto no orçamento mensal', 'Flexibilidade'],
    whenToUse: 'Quando o orçamento está apertado'
  },
  {
    id: 'custom',
    name: 'Estratégia Personalizada',
    description: 'Definir prioridades manualmente',
    icon: '🎯',
    benefits: ['Controle total', 'Adaptado à situação pessoal'],
    whenToUse: 'Quando tem necessidades específicas'
  }
];