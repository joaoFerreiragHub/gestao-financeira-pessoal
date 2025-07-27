// src/components/financial/debts/DebtStatsCard.tsx

import React from 'react';
import { Calculator, TrendingDown, AlertTriangle, Target, Clock, Percent, CreditCard } from 'lucide-react';
import { DebtStats } from '../../../types/debts';

interface DebtStatsCardProps {
  stats: DebtStats;
  showBalances: boolean;
  formatCurrency: (amount: number) => string;
}

export const DebtStatsCard: React.FC<DebtStatsCardProps> = ({
  stats,
  showBalances,
  formatCurrency,
}) => {
  const getDebtToIncomeColor = (ratio: number) => {
    if (ratio <= 20) return 'text-green-600';
    if (ratio <= 36) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDebtToIncomeStatus = (ratio: number) => {
    if (ratio <= 20) return 'Excelente';
    if (ratio <= 36) return 'Aceitável';
    return 'Alto Risco';
  };

  const formatTime = (months: number) => {
    if (months <= 0) return 'N/A';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths}m`;
    if (remainingMonths === 0) return `${years}a`;
    return `${years}a ${remainingMonths}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total de Dívidas */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Total de Dívidas</p>
            <p className="text-2xl font-bold text-red-600">
              {showBalances ? formatCurrency(stats.totalDebt) : '€•••••'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Saldo atual devedor
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Pagamentos Mensais */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Pagamentos Mensais</p>
            <p className="text-2xl font-bold text-orange-600">
              {showBalances ? formatCurrency(stats.totalMonthlyPayments) : '€•••••'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Prestações mensais
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-lg">
            <Calculator className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tempo para Quitação */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Tempo para Quitação</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatTime(stats.payoffProjection.months)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Com pagamentos atuais
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Taxa de Juro Média */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Taxa Média</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.averageInterestRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Taxa de juro média
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <Percent className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Juros Totais Projetados */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Juros Totais</p>
            <p className="text-2xl font-bold text-yellow-600">
              {showBalances ? formatCurrency(stats.payoffProjection.totalInterest) : '€•••••'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Juros a pagar
            </p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <TrendingDown className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Rácio Dívida/Rendimento */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Rácio Dívida/Renda</p>
            <p className={`text-2xl font-bold ${getDebtToIncomeColor(stats.debtToIncomeRatio)}`}>
              {stats.debtToIncomeRatio.toFixed(1)}%
            </p>
            <p className={`text-sm mt-1 ${getDebtToIncomeColor(stats.debtToIncomeRatio)}`}>
              {getDebtToIncomeStatus(stats.debtToIncomeRatio)}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${
            stats.debtToIncomeRatio <= 20 ? 'bg-green-100' :
            stats.debtToIncomeRatio <= 36 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            {stats.debtToIncomeRatio <= 20 ? (
              <Target className="h-6 w-6 text-green-600" />
            ) : stats.debtToIncomeRatio <= 36 ? (
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Resumo dos Pagamentos deste Ano */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Ano</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Principal Pago</p>
            <p className="text-xl font-bold text-green-600">
              {showBalances ? formatCurrency(stats.totalPrincipalPaid) : '€•••••'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Juros Pagos</p>
            <p className="text-xl font-bold text-red-600">
              {showBalances ? formatCurrency(stats.totalInterestPaid) : '€•••••'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Pago</p>
            <p className="text-xl font-bold text-blue-600">
              {showBalances ? formatCurrency(stats.totalPrincipalPaid + stats.totalInterestPaid) : '€•••••'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};