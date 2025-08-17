// src/components/financial/expenses/components/ExpenseOverview.tsx
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ExpenseStats {
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
  budgetVsActual: {
    categoryId: string;
    budgeted: number;
    actual: number;
    variance: number;
  }[];
}

interface ExpenseOverviewProps {
  stats: ExpenseStats;
  showBalances: boolean;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

export const ExpenseOverview: React.FC<ExpenseOverviewProps> = ({
  stats,
  showBalances,
  formatCurrency,
  formatPercentage
}) => {
  const totalBudgeted = stats.budgetVsActual.reduce((sum, item) => sum + item.budgeted, 0);
  const totalActual = stats.budgetVsActual.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalBudgeted;
  const isOverBudget = totalVariance > 0;

  const getTopCategories = () => {
    return stats.categoryBreakdown
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const getBudgetAlerts = () => {
    return stats.budgetVsActual
      .filter(item => item.variance > item.budgeted * 0.1) // 10% acima do orçamento
      .sort((a, b) => b.variance - a.variance)
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {showBalances ? formatCurrency(stats.totalExpenses) : '€ •••••'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">Total de Despesas</h3>
            <p className="text-sm text-blue-600">Este mês</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600">
              {showBalances ? formatCurrency(stats.fixedExpenses) : '€ •••••'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-green-800">Despesas Fixas</h3>
            <p className="text-sm text-green-600">
              {formatPercentage((stats.fixedExpenses / stats.totalExpenses) * 100)} do total
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-orange-600">
              {showBalances ? formatCurrency(stats.variableExpenses) : '€ •••••'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-orange-800">Despesas Variáveis</h3>
            <p className="text-sm text-orange-600">
              {formatPercentage((stats.variableExpenses / stats.totalExpenses) * 100)} do total
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-red-600">
              {showBalances ? formatCurrency(stats.debtPayments) : '€ •••••'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Pagamento de Dívidas</h3>
            <p className="text-sm text-red-600">
              {formatPercentage((stats.debtPayments / stats.totalExpenses) * 100)} do total
            </p>
          </div>
        </div>
      </div>

      {/* Budget vs Actual Alert */}
      {isOverBudget && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-2">Orçamento Excedido</h3>
              <p className="text-yellow-700 mb-3">
                Gastou {showBalances ? formatCurrency(totalVariance) : '€ •••'} acima do orçamento este mês.
              </p>
              {getBudgetAlerts().length > 0 && (
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-2">Categorias com maior desvio:</p>
                  <ul className="space-y-1">
                    {getBudgetAlerts().map((alert, index) => (
                      <li key={index} className="text-sm text-yellow-700">
                        • <span className="font-medium">{alert.categoryId}</span>: 
                        {showBalances ? ` +${formatCurrency(alert.variance)}` : ' +€ •••'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <PieChart className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Top 5 Categorias</h3>
          </div>
          
          <div className="space-y-4">
            {getTopCategories().map((category, index) => (
              <div key={category.categoryId} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">{category.categoryName}</span>
                    <span className="font-semibold text-gray-900">
                      {showBalances ? formatCurrency(category.amount) : '€ •••••'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{formatPercentage(category.percentage)} do total</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Performance */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Performance do Orçamento</h3>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Orçamentado</span>
              <span className="font-semibold">
                {showBalances ? formatCurrency(totalBudgeted) : '€ •••••'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Gasto</span>
              <span className="font-semibold">
                {showBalances ? formatCurrency(totalActual) : '€ •••••'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Diferença</span>
              <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                {showBalances ? 
                  `${isOverBudget ? '+' : ''}${formatCurrency(totalVariance)}` : 
                  '€ •••••'
                }
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {stats.budgetVsActual.slice(0, 5).map((item, index) => {
              const isOver = item.variance > 0;
              const percentage = item.budgeted > 0 ? (item.actual / item.budgeted) * 100 : 0;
              
              return (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.categoryId}</span>
                    <span className={`text-sm font-semibold ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                      {formatPercentage(percentage)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        percentage > 100 ? 'bg-red-500' : 
                        percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

