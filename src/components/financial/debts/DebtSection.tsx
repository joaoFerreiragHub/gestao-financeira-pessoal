// src/components/financial/debts/DebtSection.tsx
import React, { useState } from 'react';
import { 
  CreditCard, 
  TrendingDown, 
  Calculator, 
  FileText, 
  Plus,
  AlertCircle,
  Target,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';

interface DebtSectionProps {
  showBalances?: boolean;
  onToggleBalances?: () => void;
}

interface Debt {
  id: string;
  name: string;
  type: 'credit_card' | 'loan' | 'mortgage' | 'personal';
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  startDate: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const DebtSection: React.FC<DebtSectionProps> = ({
  showBalances = true,
  onToggleBalances
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'manage' | 'strategy' | 'reports'>('overview');

  // Mock debt data
  const debts: Debt[] = [
    {
      id: 'debt-1',
      name: 'Cartão de Crédito Principal',
      type: 'credit_card',
      totalAmount: 5000,
      remainingAmount: 2800,
      monthlyPayment: 150,
      interestRate: 18.5,
      startDate: '2023-01-15',
      isActive: true,
      priority: 'high'
    },
    {
      id: 'debt-2',
      name: 'Financiamento Automóvel',
      type: 'loan',
      totalAmount: 25000,
      remainingAmount: 18500,
      monthlyPayment: 320,
      interestRate: 4.2,
      startDate: '2022-06-01',
      isActive: true,
      priority: 'medium'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  const averageInterestRate = debts.length > 0 
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length 
    : 0;

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'manage', label: 'Gerir Dívidas', icon: CreditCard },
    { id: 'strategy', label: 'Estratégia', icon: Target },
    { id: 'reports', label: 'Relatórios', icon: FileText }
  ];

  const getDebtTypeIcon = (type: string) => {
    switch (type) {
      case 'credit_card': return '💳';
      case 'loan': return '🏦';
      case 'mortgage': return '🏠';
      case 'personal': return '👤';
      default: return '💼';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Dívidas</h2>
          <p className="text-gray-600">Acompanhe e gerencie todas as suas dívidas</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Dívida</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-red-600">
              {showBalances ? formatCurrency(totalDebt) : '€ •••••'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Total de Dívidas</h3>
            <p className="text-sm text-red-600">{debts.length} dívidas ativas</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-orange-600">
              {showBalances ? formatCurrency(totalMonthlyPayments) : '€ •••••'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-orange-800">Pagamentos Mensais</h3>
            <p className="text-sm text-orange-600">Obrigatórios</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {averageInterestRate.toFixed(1)}%
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-purple-800">Taxa Média</h3>
            <p className="text-sm text-purple-600">Juros anuais</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              24
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">Meses Restantes</h3>
            <p className="text-sm text-blue-600">Estimativa média</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Debt List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suas Dívidas</h3>
                <div className="space-y-4">
                  {debts.map((debt) => (
                    <div key={debt.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getDebtTypeIcon(debt.type)}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{debt.name}</h4>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(debt.priority)}`}>
                                {debt.priority === 'high' ? 'Alta' : debt.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                              </span>
                              <span className="text-sm text-gray-500">{debt.interestRate}% a.a.</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {showBalances ? formatCurrency(debt.remainingAmount) : '€ •••••'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {showBalances ? formatCurrency(debt.monthlyPayment) : '€ •••'}/mês
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progresso do pagamento</span>
                          <span>{((debt.totalAmount - debt.remainingAmount) / debt.totalAmount * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                    <Calculator className="h-6 w-6 text-blue-600 mb-2" />
                    <div className="text-sm font-medium text-blue-900">Calculadora de Pagamentos</div>
                  </button>
                  <button className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                    <Target className="h-6 w-6 text-blue-600 mb-2" />
                    <div className="text-sm font-medium text-blue-900">Estratégia de Pagamento</div>
                  </button>
                  <button className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                    <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
                    <div className="text-sm font-medium text-blue-900">Relatório Detalhado</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Dívidas</h3>
              <p className="text-gray-600 mb-6">Adicione, edite e acompanhe suas dívidas</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Adicionar Nova Dívida
              </button>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estratégia de Pagamento</h3>
              <p className="text-gray-600 mb-6">Optimize sua estratégia para quitar dívidas mais rapidamente</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Calcular Estratégia
              </button>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios</h3>
              <p className="text-gray-600 mb-6">Análises detalhadas sobre suas dívidas</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Gerar Relatório
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
