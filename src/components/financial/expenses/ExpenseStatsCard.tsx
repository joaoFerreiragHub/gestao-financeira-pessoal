// src/components/financial/expenses/ExpenseStatsCard.tsx

import React from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { ExpenseStats } from '../../../types/expenses';

interface ExpenseStatsCardProps {
  stats: ExpenseStats;
  showBalances: boolean;
  formatCurrency: (amount: number) => string;
}

export const ExpenseStatsCard: React.FC<ExpenseStatsCardProps> = ({
  stats,
  showBalances,
  formatCurrency,
}) => {
  const isMonthlyGrowthPositive = stats.growth.monthly > 0;
  const isYearlyGrowthPositive = stats.growth.yearly > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Este Mês */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Este Mês</p>
            <p className="text-2xl font-bold text-red-600">
              {showBalances ? formatCurrency(stats.totalThisMonth) : '€•••••'}
            </p>
            <div className="flex items-center mt-1">
              {isMonthlyGrowthPositive ? (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              )}
              <span className={`text-sm ${
                isMonthlyGrowthPositive ? 'text-red-500' : 'text-green-500'
              }`}>
                {Math.abs(stats.growth.monthly).toFixed(1)}%
              </span>
              <span className="text-gray-500 text-sm ml-1">vs mês anterior</span>
            </div>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Total Este Ano */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Este Ano</p>
            <p className="text-2xl font-bold text-orange-600">
              {showBalances ? formatCurrency(stats.totalThisYear) : '€•••••'}
            </p>
            <div className="flex items-center mt-1">
              {isYearlyGrowthPositive ? (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              )}
              <span className={`text-sm ${
                isYearlyGrowthPositive ? 'text-red-500' : 'text-green-500'
              }`}>
                {Math.abs(stats.growth.yearly).toFixed(1)}%
              </span>
              <span className="text-gray-500 text-sm ml-1">vs ano anterior</span>
            </div>
          </div>
          <div className="p-3 bg-orange-100 rounded-lg">
            <TrendingDown className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Média Mensal */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Média Mensal</p>
            <p className="text-2xl font-bold text-purple-600">
              {showBalances ? formatCurrency(stats.averageMonthly) : '€•••••'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Baseado no ano atual
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <TrendingDown className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Status do Orçamento */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Orçamento</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.budgetStatus.percentageUsed.toFixed(0)}%
            </p>
            <div className="flex items-center mt-1">
              {stats.budgetStatus.percentageUsed > 90 ? (
                <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              )}
              <span className={`text-sm ${
                stats.budgetStatus.percentageUsed > 90 ? 'text-red-500' : 'text-green-500'
              }`}>
                {showBalances ? formatCurrency(stats.budgetStatus.remaining) : '€•••••'} restante
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <AlertTriangle className={`h-6 w-6 ${
              stats.budgetStatus.percentageUsed > 90 ? 'text-red-600' : 'text-blue-600'
            }`} />
          </div>
        </div>
      </div>

      {/* Despesas Essenciais vs Não Essenciais */}
      <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Análise Essencial vs Supérfluas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {showBalances ? formatCurrency(stats.essentialVsNonEssential.essential) : '€•••••'}
            </p>
            <p className="text-sm text-gray-600">Despesas Essenciais</p>
            <p className="text-xs text-gray-500">{stats.essentialVsNonEssential.essentialPercentage.toFixed(1)}% do total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {showBalances ? formatCurrency(stats.essentialVsNonEssential.nonEssential) : '€•••••'}
            </p>
            <p className="text-sm text-gray-600">Despesas Supérfluas</p>
            <p className="text-xs text-gray-500">{(100 - stats.essentialVsNonEssential.essentialPercentage).toFixed(1)}% do total</p>
          </div>
          <div className="text-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.essentialVsNonEssential.essentialPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Proporção Essencial</p>
          </div>
        </div>
      </div>
    </div>
  );
};