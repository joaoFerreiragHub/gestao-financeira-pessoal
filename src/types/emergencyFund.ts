// src/types/emergencyFund.ts

export interface EmergencyFund {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetMonths: number;
  monthlyContribution: number;
  planType: 'conservative' | 'moderate' | 'aggressive';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface EmergencyPlan {
  id: string;
  name: string;
  months: number;
  description: string;
  icon: any;
  color: string;
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
  features: string[];
  recommendedFor: string[];
}

export interface EmergencyFundAccount {
  id: string;
  name: string;
  balance: number;
  isEmergencyFund: boolean;
  accountType: 'savings' | 'checking' | 'term_deposit' | 'money_market';
  interestRate?: number;
  liquidityDays: number; // Dias para acesso aos fundos
  minimumBalance?: number;
}

export interface EmergencyFundCalculation {
  targetAmount: number;
  currentAmount: number;
  remaining: number;
  progressPercentage: number;
  currentMonths: number;
  monthsToComplete: number;
  recommendedMonthlyContribution: number;
  projectedCompletionDate: string;
}

export interface EmergencyFundGoal {
  id: string;
  title: string;
  targetAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface EmergencyFundTransaction {
  id: string;
  fundId: string;
  type: 'contribution' | 'withdrawal' | 'transfer';
  amount: number;
  date: string;
  description?: string;
  fromAccount?: string;
  toAccount?: string;
  reason?: 'emergency' | 'goal_completion' | 'rebalancing' | 'other';
  createdAt: string;
}

export interface EmergencyFundSettings {
  autoContribution: boolean;
  monthlyContributionAmount: number;
  contributionDay: number; // Dia do mês (1-31)
  lowBalanceAlert: boolean;
  lowBalanceThreshold: number; // Percentual da meta
  targetMonths: number;
  preferredAccounts: string[]; // IDs das contas preferenciais
}

export interface EmergencyFundStats {
  totalFunds: number;
  monthlyContributions: number;
  totalWithdrawals: number;
  averageMonthlyGrowth: number;
  timesToGoal: number; // Meses
  fundCoverage: number; // Meses de despesas cobertas
  lastContribution: {
    amount: number;
    date: string;
  };
  lastWithdrawal?: {
    amount: number;
    date: string;
    reason: string;
  };
}

export interface EmergencyScenario {
  id: string;
  name: string;
  description: string;
  estimatedCost: number;
  duration: number; // Duração em meses
  probability: 'low' | 'medium' | 'high';
  category: 'health' | 'job_loss' | 'home' | 'car' | 'family' | 'other';
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface EmergencyFundStatus {
  status: 'critical' | 'low' | 'building' | 'adequate' | 'excellent';
  message: string;
  color: string;
  recommendations: string[];
  coverage: number; // Meses de cobertura atual
  healthScore: number; // 0-100
}

// Tipos para hooks e contexto
export interface UseEmergencyFundReturn {
  fund: EmergencyFund | null;
  accounts: EmergencyFundAccount[];
  transactions: EmergencyFundTransaction[];
  calculations: EmergencyFundCalculation;
  stats: EmergencyFundStats;
  status: EmergencyFundStatus;
  settings: EmergencyFundSettings;
  
  // Ações
  updateFund: (fund: Partial<EmergencyFund>) => void;
  addContribution: (amount: number, fromAccount: string, description?: string) => void;
  makeWithdrawal: (amount: number, toAccount: string, reason: string, description?: string) => void;
  updateSettings: (settings: Partial<EmergencyFundSettings>) => void;
  allocateAccount: (accountId: string, isEmergencyFund: boolean) => void;
  
  // Cálculos
  calculateTimeToGoal: (monthlyContribution: number) => number;
  calculateRecommendedContribution: (targetMonths: number, timeframe: number) => number;
  simulateScenario: (scenario: EmergencyScenario) => {
    wouldCover: boolean;
    shortfall: number;
    recommendedIncrease: number;
  };
}

// Constantes
export const EMERGENCY_FUND_PLANS: EmergencyPlan[] = [
  {
    id: 'conservative',
    name: 'Conservador',
    months: 8,
    description: 'Para maior segurança e tranquilidade',
    icon: 'Shield',
    color: 'blue',
    riskLevel: 'Baixo',
    features: [
      '8 meses de despesas cobertas',
      'Máxima segurança financeira',
      'Ideal para rendimentos instáveis'
    ],
    recommendedFor: [
      'Trabalhadores independentes',
      'Famílias com filhos',
      'Pessoas próximas da reforma'
    ]
  },
  {
    id: 'moderate',
    name: 'Moderado',
    months: 6,
    description: 'Equilíbrio entre segurança e flexibilidade',
    icon: 'Target',
    color: 'green',
    riskLevel: 'Médio',
    features: [
      '6 meses de despesas cobertas',
      'Equilibrio ideal',
      'Recomendado por especialistas'
    ],
    recommendedFor: [
      'Trabalhadores com emprego estável',
      'Casais sem filhos',
      'Perfil de risco moderado'
    ]
  },
  {
    id: 'aggressive',
    name: 'Agressivo',
    months: 3,
    description: 'Mínimo para focar em investimentos',
    icon: 'Zap',
    color: 'orange',
    riskLevel: 'Alto',
    features: [
      '3 meses de despesas cobertas',
      'Foco em investimentos',
      'Para perfis mais arrojados'
    ],
    recommendedFor: [
      'Jovens profissionais',
      'Sem dependentes',
      'Múltiplas fontes de renda'
    ]
  }
];

export const EMERGENCY_SCENARIOS: EmergencyScenario[] = [
  {
    id: 'job_loss',
    name: 'Perda de Emprego',
    description: 'Desemprego involuntário',
    estimatedCost: 0, // Será baseado nas despesas mensais
    duration: 6,
    probability: 'medium',
    category: 'job_loss',
    impact: 'critical'
  },
  {
    id: 'medical_emergency',
    name: 'Emergência Médica',
    description: 'Despesas médicas não cobertas',
    estimatedCost: 5000,
    duration: 1,
    probability: 'low',
    category: 'health',
    impact: 'high'
  },
  {
    id: 'home_repair',
    name: 'Reparação Urgente Casa',
    description: 'Reparações estruturais essenciais',
    estimatedCost: 3000,
    duration: 1,
    probability: 'medium',
    category: 'home',
    impact: 'medium'
  },
  {
    id: 'car_repair',
    name: 'Reparação Automóvel',
    description: 'Avaria major do veículo',
    estimatedCost: 1500,
    duration: 1,
    probability: 'high',
    category: 'car',
    impact: 'medium'
  }
];

// Utilitários de cálculo
export const calculateEmergencyFundHealth = (
  currentAmount: number,
  monthlyExpenses: number,
  targetMonths: number
): EmergencyFundStatus => {
  const coverage = currentAmount / monthlyExpenses;
  const progressToTarget = (coverage / targetMonths) * 100;

  if (coverage >= targetMonths) {
    return {
      status: 'excellent',
      message: 'Fundo de emergência completo!',
      color: 'green',
      recommendations: ['Considere investir o excesso', 'Mantenha contribuições regulares'],
      coverage,
      healthScore: 100
    };
  } else if (coverage >= targetMonths * 0.75) {
    return {
      status: 'adequate',
      message: 'Quase lá!',
      color: 'blue',
      recommendations: ['Continue as contribuições regulares', 'Está no bom caminho'],
      coverage,
      healthScore: Math.round(progressToTarget)
    };
  } else if (coverage >= targetMonths * 0.5) {
    return {
      status: 'building',
      message: 'Em construção',
      color: 'yellow',
      recommendations: ['Aumente as contribuições se possível', 'Mantenha o foco'],
      coverage,
      healthScore: Math.round(progressToTarget)
    };
  } else if (coverage >= 1) {
    return {
      status: 'low',
      message: 'Fundo insuficiente',
      color: 'orange',
      recommendations: ['Priorize o fundo de emergência', 'Reduza gastos não essenciais'],
      coverage,
      healthScore: Math.round(progressToTarget)
    };
  } else {
    return {
      status: 'critical',
      message: 'Situação crítica',
      color: 'red',
      recommendations: ['Urgente: crie um fundo de emergência', 'Comece com pequenas quantias'],
      coverage,
      healthScore: Math.round(progressToTarget)
    };
  }
};

// Função para calcular contribuição recomendada
export const calculateRecommendedContribution = (
  targetAmount: number,
  currentAmount: number,
  monthsToGoal: number,
  monthlySavings: number
): number => {
  const remaining = targetAmount - currentAmount;
  const calculatedContribution = remaining / monthsToGoal;
  const maxRecommended = monthlySavings * 0.4; // Máximo 40% das poupanças
  
  return Math.min(calculatedContribution, maxRecommended);
};

// Função para simular cenários de emergência
export const simulateEmergencyScenario = (
  scenario: EmergencyScenario,
  currentFund: number,
  monthlyExpenses: number
): {
  wouldCover: boolean;
  shortfall: number;
  recommendedIncrease: number;
  impactMonths: number;
} => {
  const totalCost = scenario.estimatedCost || (monthlyExpenses * scenario.duration);
  const wouldCover = currentFund >= totalCost;
  const shortfall = Math.max(0, totalCost - currentFund);
  const recommendedIncrease = shortfall * 1.2; // 20% buffer
  const impactMonths = totalCost / monthlyExpenses;

  return {
    wouldCover,
    shortfall,
    recommendedIncrease,
    impactMonths
  };
};

// Validações
export const validateEmergencyFund = (fund: Partial<EmergencyFund>): string[] => {
  const errors: string[] = [];

  if (!fund.targetAmount || fund.targetAmount <= 0) {
    errors.push('Valor meta deve ser maior que zero');
  }

  if (!fund.targetMonths || fund.targetMonths < 1 || fund.targetMonths > 24) {
    errors.push('Meses alvo deve estar entre 1 e 24');
  }

  if (fund.monthlyContribution && fund.monthlyContribution < 0) {
    errors.push('Contribuição mensal não pode ser negativa');
  }

  return errors;
};