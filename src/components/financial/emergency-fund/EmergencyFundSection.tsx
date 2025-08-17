import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Calendar, 
  Zap,
  Plus,
  Eye,
  EyeOff,
  Info,
  ArrowUp,
  ArrowDown,
  PiggyBank,
  Wallet
} from 'lucide-react';
import { formatCurrency } from '../../../utils/financial/formatters';
import { calculateEmergencyFundMetrics } from '../../../utils/financial/calculations';
import { EmergencyFundCalculator } from './EmergencyFundCalculator';
import { FundStatusCard } from './components/FundStatusCard';
import { PlanCard } from './components/PlanCard';

interface EmergencyFundSectionProps {
  showBalances?: boolean;
  onToggleBalances?: () => void;
}

interface FinancialData {
  monthlyExpenses: number;
  currentEmergencyFund: number;
  savingsAccounts: Array<{
    id: string;
    name: string;
    balance: number;
    isEmergencyFund: boolean;
  }>;
  monthlyIncome: number;
  monthlySavings: number;
}

interface EmergencyPlan {
  id: string;
  name: string;
  months: number;
  description: string;
  icon: any;
  color: string;
  riskLevel: string;
}

export const EmergencyFundSection: React.FC<EmergencyFundSectionProps> = ({
  showBalances = true,
  onToggleBalances
}) => {
  const [selectedPlan, setSelectedPlan] = useState('moderate');
  const [targetMonths, setTargetMonths] = useState(6);
  const [monthlyContribution, setMonthlyContribution] = useState(200);

  // Dados mock financeiros
  const financialData: FinancialData = {
    monthlyExpenses: 1380,
    currentEmergencyFund: 4200,
    savingsAccounts: [
      { id: '1', name: 'Conta Poupança Principal', balance: 2800, isEmergencyFund: true },
      { id: '2', name: 'Depósito a Prazo', balance: 1400, isEmergencyFund: true },
      { id: '3', name: 'Conta Corrente', balance: 800, isEmergencyFund: false }
    ],
    monthlyIncome: 3300,
    monthlySavings: 1500
  };

  // Planos pré-definidos
  const emergencyPlans: EmergencyPlan[] = [
    {
      id: 'conservative',
      name: 'Conservador',
      months: 8,
      description: 'Para maior segurança e tranquilidade',
      icon: Shield,
      color: 'blue',
      riskLevel: 'Baixo'
    },
    {
      id: 'moderate',
      name: 'Moderado',
      months: 6,
      description: 'Equilibrio entre segurança e flexibilidade',
      icon: Target,
      color: 'green',
      riskLevel: 'Médio'
    },
    {
      id: 'aggressive',
      name: 'Agressivo',
      months: 3,
      description: 'Mínimo para focar em investimentos',
      icon: Zap,
      color: 'orange',
      riskLevel: 'Alto'
    }
  ];

  // Plano selecionado
  const selectedPlanData = emergencyPlans.find(plan => plan.id === selectedPlan) || emergencyPlans[1];

  // Cálculos do fundo de emergência usando função centralizada
  const calculations = calculateEmergencyFundMetrics(
    {
      monthlyExpenses: financialData.monthlyExpenses,
      currentEmergencyFund: financialData.currentEmergencyFund
    },
    { ...selectedPlanData, months: targetMonths },
    monthlyContribution
  );



  // Status do fundo
  const getFundStatus = () => {
    const percentage = calculations.progressPercentage;
    if (percentage >= 100) return { status: 'complete', color: 'green', message: 'Meta atingida!' };
    if (percentage >= 75) return { status: 'near', color: 'blue', message: 'Quase lá!' };
    if (percentage >= 50) return { status: 'progress', color: 'yellow', message: 'Em progresso' };
    if (percentage >= 25) return { status: 'started', color: 'orange', message: 'Começando bem' };
    return { status: 'critical', color: 'red', message: 'Prioridade alta' };
  };

  const status = getFundStatus();

  // Componente de Métrica
  const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'gray', trend = null }: {
    title: string;
    value: string;
    subtitle: string;
    icon: any;
    color?: string;
    trend?: number | null;
  }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {showBalances ? value : '••••••'}
        </h3>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  // Componente de Conta
  const AccountCard = ({ account }: { account: any }) => (
    <div className={`p-4 rounded-lg border ${
      account.isEmergencyFund ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Wallet className={`h-4 w-4 ${account.isEmergencyFund ? 'text-green-600' : 'text-gray-400'}`} />
          <span className="font-medium text-gray-900">{account.name}</span>
        </div>
        {account.isEmergencyFund && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Fundo Emergência
          </span>
        )}
      </div>
      <p className="text-lg font-bold text-gray-900">
        {showBalances ? formatCurrency(account.balance) : '••••••'}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fundo de Emergência</h1>
          <p className="text-gray-600">
            Proteja-se contra imprevistos financeiros com um fundo de emergência adequado
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {onToggleBalances && (
            <button
              onClick={onToggleBalances}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={showBalances ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {showBalances ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Contribuir</span>
          </button>
        </div>
      </div>

      {/* Status Geral */}
      <FundStatusCard 
        status={status}
        currentAmount={financialData.currentEmergencyFund}
        targetAmount={calculations.targetAmount}
        currentMonths={calculations.currentMonths}
        progressPercentage={calculations.progressPercentage}
        showBalances={showBalances}
        formatCurrency={formatCurrency}
      />

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Valor Atual"
          value={formatCurrency(financialData.currentEmergencyFund)}
          subtitle="Disponível para emergências"
          icon={PiggyBank}
          color="green"
          trend={5.2}
        />
        <MetricCard
          title="Meta Definida"
          value={formatCurrency(calculations.targetAmount)}
          subtitle={`${targetMonths} meses de despesas`}
          icon={Target}
          color="blue"
        />
        <MetricCard
          title="Falta Atingir"
          value={formatCurrency(Math.max(0, calculations.remaining))}
          subtitle="Para completar a meta"
          icon={Clock}
          color="orange"
        />
        <MetricCard
          title="Tempo Estimado"
          value={calculations.monthsToComplete > 0 ? `${calculations.monthsToComplete} meses` : 'Completo'}
          subtitle={`Com ${formatCurrency(monthlyContribution)}/mês`}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Planos de Emergência */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Escolha seu Plano</h2>
          <div className="flex items-center space-x-1 text-blue-600">
            <Info className="h-4 w-4" />
            <span className="text-sm">Baseado nas suas despesas mensais</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {emergencyPlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              monthlyExpenses={financialData.monthlyExpenses}
              currentAmount={financialData.currentEmergencyFund}
              monthlyContribution={monthlyContribution}
              showBalances={showBalances}
              formatCurrency={formatCurrency}
              onSelect={(plan) => {
                setSelectedPlan(plan.id);
                setTargetMonths(plan.months);
              }}
            />
          ))}
        </div>

        {/* Calculadora de Contribuição */}
        <EmergencyFundCalculator
          monthlyContribution={monthlyContribution}
          setMonthlyContribution={setMonthlyContribution}
          targetMonths={targetMonths}
          setTargetMonths={setTargetMonths}
          calculations={calculations}
          monthlySavings={financialData.monthlySavings}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Contas Designadas */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Contas para Fundo de Emergência</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Gerir Alocações
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {financialData.savingsAccounts.map(account => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>

        {/* Dicas */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Dicas para o Fundo de Emergência</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Mantenha o fundo em contas líquidas e de fácil acesso</li>
                <li>• Não use para investimentos de risco - priorize a segurança</li>
                <li>• Revise regularmente se o valor está adequado às suas despesas</li>
                <li>• Use apenas para verdadeiras emergências (desemprego, saúde, etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};