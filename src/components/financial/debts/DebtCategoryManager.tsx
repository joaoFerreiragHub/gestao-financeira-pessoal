// src/components/financial/debts/DebtCategoryManager.tsx

import React, { useMemo } from 'react';
import { Plus, Edit3, Trash2, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { DebtCategory, DebtEntry } from '../../../types/debts';

interface DebtCategoryManagerProps {
  categories: DebtCategory[];
  debts: DebtEntry[];
  showBalances: boolean;
  onAddCategory: () => void;
  onEditCategory: (category: DebtCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  formatCurrency: (amount: number) => string;
}

export const DebtCategoryManager: React.FC<DebtCategoryManagerProps> = ({
  categories,
  debts,
  showBalances,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  formatCurrency,
}) => {
  // Calcular estatísticas por categoria
  const categoryStats = useMemo(() => {
    return categories.map(category => {
      const categoryDebts = debts.filter(debt => debt.categoryId === category.id && debt.isActive);
      const totalBalance = categoryDebts.reduce((sum, debt) => sum + debt.currentBalance, 0);
      const totalMonthlyPayment = categoryDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
      const averageInterestRate = categoryDebts.length > 0 
        ? categoryDebts.reduce((sum, debt) => sum + debt.interestRate, 0) / categoryDebts.length 
        : 0;
      
      return {
        ...category,
        debtCount: categoryDebts.length,
        totalBalance,
        totalMonthlyPayment,
        averageInterestRate,
      };
    });
  }, [categories, debts]);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-50 border-red-200 text-red-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      pink: 'bg-pink-50 border-pink-200 text-pink-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getIconColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      pink: 'bg-pink-100 text-pink-600',
      indigo: 'bg-indigo-100 text-indigo-600',
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  const handleDeleteCategory = (category: DebtCategory) => {
    const categoryDebts = debts.filter(debt => debt.categoryId === category.id);
    
    if (categoryDebts.length > 0) {
      const confirmed = window.confirm(
        `Tem a certeza que quer eliminar a categoria "${category.name}"? ` +
        `Isto irá também eliminar ${categoryDebts.length} dívida(s) associada(s).`
      );
      if (!confirmed) return;
    }
    
    onDeleteCategory(category.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestão de Categorias</h3>
          <p className="text-sm text-gray-600">
            Organize as suas dívidas por categorias para melhor controlo
          </p>
        </div>
        <button
          onClick={onAddCategory}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </button>
      </div>

      {/* Categorias Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryStats.map((category) => (
          <div
            key={category.id}
            className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${getColorClasses(category.color)}`}
          >
            {/* Header da Categoria */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getIconColorClasses(category.color)}`}>
                  <span className="text-lg">{category.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEditCategory(category)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Editar categoria"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Eliminar categoria"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Estatísticas da Categoria */}
            <div className="space-y-3">
              {/* Número de Dívidas */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dívidas:</span>
                <span className="font-medium">{category.debtCount}</span>
              </div>

              {/* Saldo Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Saldo Total:</span>
                <span className="font-medium text-red-600">
                  {showBalances ? formatCurrency(category.totalBalance) : '€•••••'}
                </span>
              </div>

              {/* Pagamento Mensal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pagamento Mensal:</span>
                <span className="font-medium text-orange-600">
                  {showBalances ? formatCurrency(category.totalMonthlyPayment) : '€•••••'}
                </span>
              </div>

              {/* Taxa Média */}
              {category.averageInterestRate > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taxa Média:</span>
                  <span className="font-medium text-purple-600">
                    {category.averageInterestRate.toFixed(1)}%
                  </span>
                </div>
              )}

              {/* Status da Categoria */}
              <div className="flex items-center justify-between pt-2 border-t border-current border-opacity-20">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center space-x-1">
                  {category.isActive ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Ativa</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-500">Inativa</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Alertas */}
            {category.debtCount === 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    Categoria sem dívidas
                  </span>
                </div>
              </div>
            )}

            {category.totalBalance > 0 && category.averageInterestRate > 20 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">
                    Taxa de juro alta
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Estatísticas Gerais */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumo Geral</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Categorias</p>
            <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Categorias Ativas</p>
            <p className="text-2xl font-bold text-green-600">
              {categories.filter(c => c.isActive).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Com Dívidas</p>
            <p className="text-2xl font-bold text-orange-600">
              {categoryStats.filter(c => c.debtCount > 0).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Sem Dívidas</p>
            <p className="text-2xl font-bold text-gray-600">
              {categoryStats.filter(c => c.debtCount === 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};