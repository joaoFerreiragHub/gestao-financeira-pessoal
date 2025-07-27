// src/components/financial/debts/DebtStatsCard.tsx

import React from 'react';
import { Calculator, TrendingDown, AlertTriangle, Target, Clock, Percent } from 'lucide-react';
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total de Dívidas */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Dívidas</p>
            <p className="text-2xl font-bold text-red-600">
              {showBalances ? formatCurrency(stats.totalDebt) : '€•••••'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Saldo atual devedor
            </p>
          </div>
      </div>

      {/* Tempo para Quitação */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tempo para Quitação</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.payoffProjection.months > 0 ? `${Math.floor(stats.payoffProjection.months / 12)}a ${stats.payoffProjection.months % 12}m` : 'N/A'}
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

      {/* Juros Totais Projetados */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Juros Totais</p>
            <p className="text-2xl font-bold text-yellow-600">
              {showBalances ? formatCurrency(stats.payoffProjection.totalInterest) : '€•••••'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Custo total projetado
            </p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Percent className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Progresso Este Ano */}
      <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Progresso Este Ano</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {showBalances ? formatCurrency(stats.totalPrincipalPaid) : '€•••••'}
            </p>
            <p className="text-sm text-gray-600">Principal Pago</p>
            <p className="text-xs text-gray-500 mt-1">Redução da dívida</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {showBalances ? formatCurrency(stats.totalInterestPaid) : '€•••••'}
            </p>
            <p className="text-sm text-gray-600">Juros Pagos</p>
            <p className="text-xs text-gray-500 mt-1">Custo do capital</p>
          </div>
          <div className="text-center">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${stats.totalPrincipalPaid + stats.totalInterestPaid > 0 
                    ? (stats.totalPrincipalPaid / (stats.totalPrincipalPaid + stats.totalInterestPaid)) * 100 
                    : 0}%` 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Eficiência dos Pagamentos</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalPrincipalPaid + stats.totalInterestPaid > 0 
                ? `${((stats.totalPrincipalPaid / (stats.totalPrincipalPaid + stats.totalInterestPaid)) * 100).toFixed(1)}% para principal`
                : 'Sem dados'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Distribuição por Prioridade */}
      <div className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribuição por Prioridade</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Alta Prioridade */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-red-900">Alta Prioridade</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dívidas:</span>
                <span className="font-medium">{stats.byPriority.high.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="font-medium text-red-700">
                  {showBalances ? formatCurrency(stats.byPriority.high.totalDebt) : '€•••••'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mensal:</span>
                <span className="font-medium">
                  {showBalances ? formatCurrency(stats.byPriority.high.monthlyPayment) : '€•••••'}
                </span>
              </div>
            </div>
          </div>

          {/* Média Prioridade */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900">Média Prioridade</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dívidas:</span>
                <span className="font-medium">{stats.byPriority.medium.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="font-medium text-yellow-700">
                  {showBalances ? formatCurrency(stats.byPriority.medium.totalDebt) : '€•••••'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mensal:</span>
                <span className="font-medium">
                  {showBalances ? formatCurrency(stats.byPriority.medium.monthlyPayment) : '€•••••'}
                </span>
              </div>
            </div>
          </div>

          {/* Baixa Prioridade */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Baixa Prioridade</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dívidas:</span>
                <span className="font-medium">{stats.byPriority.low.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="font-medium text-green-700">
                  {showBalances ? formatCurrency(stats.byPriority.low.totalDebt) : '€•••••'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mensal:</span>
                <span className="font-medium">
                  {showBalances ? formatCurrency(stats.byPriority.low.monthlyPayment) : '€•••••'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
          <div className="p-3 bg-red-100 rounded-lg">
            <Calculator className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Pagamentos Mensais */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pagamentos Mensais</p>
            <p className="text-2xl font-bold text-orange-600">
              {showBalances ? formatCurrency(stats.totalMonthlyPayments) : '€•••••'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Comprometimento mensal
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-lg">
            <TrendingDown className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Taxa Média de Juros */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Taxa Média</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.averageInterestRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Taxa ponderada anual
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <Percent className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Ratio Dívida/Renda */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ratio Dívida/Renda</p>
            <p className={`text-2xl font-bold ${getDebtToIncomeColor(stats.debtToIncomeRatio)}`}>
              {stats.debtToIncomeRatio.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {getDebtToIncomeStatus(stats.debtToIncomeRatio)}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${
            stats.debtToIncomeRatio <= 20 ? 'bg-green-100' :
            stats.debtToIncomeRatio <= 36 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            {stats.debtToIncomeRatio > 36 ? (
              <AlertTriangle className={`h-6 w-6 ${getDebtToIncomeColor(stats.debtToIncomeRatio)}`} />
            ) : (
              <Target className={`h-6 w-6 ${getDebtToIncomeColor(stats.debtToIncomeRatio)}`} />
            )}
          </div>