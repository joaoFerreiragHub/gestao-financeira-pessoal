import React from 'react';
import { MoreHorizontal, AlertTriangle } from 'lucide-react';

interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string;
  isRecurring?: boolean;
  debtId?: string;
}

interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  monthlyPayment: number;
  interestRate: number;
  remainingMonths: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  budget: number;
  isDebtCategory?: boolean;
}

interface CategoryCardProps {
  category: Category;
  expenses: ExpenseEntry[];
  showBalances: boolean;
  formatCurrency: (value: number) => string;
  debts?: Debt[];
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  expenses,
  showBalances,
  formatCurrency,
  debts = []
}) => {
  const Icon = category.icon;
  const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = category.budget - spent;
  const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;

  const getDebtExpenses = () => {
    return expenses.filter(expense => expense.debtId);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">{expenses.length} transações</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Valores */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Gasto</span>
          <span className="font-semibold text-gray-900">
            {showBalances ? formatCurrency(spent) : '••••••'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Orçamento</span>
          <span className="font-semibold text-gray-900">
            {showBalances ? formatCurrency(category.budget) : '••••••'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Restante</span>
          <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {showBalances ? formatCurrency(remaining) : '••••••'}
          </span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              percentage > 100 ? 'bg-red-500' : 
              percentage > 80 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{percentage.toFixed(1)}% usado</span>
          <span>{Math.max(0, 100 - percentage).toFixed(1)}% disponível</span>
        </div>
      </div>

      {/* Tag especial para dívidas */}
      {category.isDebtCategory && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Pagamentos de Dívidas</span>
          </div>
          <p className="text-xs text-red-600">
            Sincronizado com a tab Dívidas. {getDebtExpenses().length} pagamentos registados.
          </p>
          
          {debts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs text-red-700 font-medium mb-2">Dívidas ativas:</p>
              {debts.slice(0, 2).map(debt => (
                <div key={debt.id} className="flex justify-between text-xs text-red-600 mb-1">
                  <span>{debt.name}</span>
                  <span>{showBalances ? formatCurrency(debt.monthlyPayment) : '•••'}/mês</span>
                </div>
              ))}
              {debts.length > 2 && (
                <p className="text-xs text-red-500">+{debts.length - 2} mais...</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};