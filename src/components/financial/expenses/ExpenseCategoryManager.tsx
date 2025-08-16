// src/components/financial/expenses/ExpenseCategoryManager.tsx

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag, TrendingUp, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { ExpenseCategory, ExpenseEntry } from '../../../types/financial/expenses';

interface ExpenseCategoryManagerProps {
  categories: ExpenseCategory[];
  entries: ExpenseEntry[];
  showBalances: boolean;
  onAddCategory: () => void;
  onEditCategory: (category: ExpenseCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  formatCurrency: (amount: number) => string;
}

export const ExpenseCategoryManager: React.FC<ExpenseCategoryManagerProps> = ({
  categories,
  entries,
  showBalances,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  formatCurrency,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
const [sortBy, setSortBy] = useState<SortOption>('name');


  // Calcular estatísticas para cada categoria
  const categoriesWithStats = categories.map(category => {
    const categoryEntries = entries.filter(entry => entry.categoryId === category.id);
    const thisYearEntries = categoryEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const currentYear = new Date().getFullYear();
      return entryDate.getFullYear() === currentYear;
    });

    const totalSpent = thisYearEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const monthlyAverage = totalSpent / 12;
    const budgetUsage = category.budgetLimit ? (monthlyAverage / category.budgetLimit) * 100 : 0;
    const entryCount = categoryEntries.length;

    return {
      ...category,
      stats: {
        totalSpent,
        monthlyAverage,
        budgetUsage,
        entryCount,
        isOverBudget: budgetUsage > 100,
      },
    };
  });

  // Ordenar categorias
  const sortedCategories = [...categoriesWithStats].sort((a, b) => {
    switch (sortBy) {
      case 'usage':
        return b.stats.totalSpent - a.stats.totalSpent;
      case 'budget':
        return b.stats.budgetUsage - a.stats.budgetUsage;
      default:
        return a.name.localeCompare(b.name);
    }
  });
type SortOption = 'name' | 'usage' | 'budget';
  const handleDeleteConfirm = (categoryId: string) => {
    onDeleteCategory(categoryId);
    setShowDeleteConfirm(null);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      slate: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Gestão de Categorias ({categories.length})
          </h3>
          <p className="text-gray-600">
            Organize e configure suas categorias de despesas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="usage">Ordenar por Uso</option>
            <option value="budget">Ordenar por Orçamento</option>
          </select>
          <button
            onClick={onAddCategory}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </button>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCategories.map((category) => (
          <div
            key={category.id}
            className={`bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all ${
              category.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}
          >
            {/* Header da Categoria */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getColorClasses(category.color)}`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-500">
                    {category.stats.entryCount} despesa{category.stats.entryCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEditCategory(category)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar categoria"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(category.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir categoria"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Descrição */}
            {category.description && (
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            )}

            {/* Estatísticas */}
            <div className="space-y-3">
              {/* Gasto Total no Ano */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gasto este ano:</span>
                <span className="font-medium text-gray-900">
                  {showBalances ? formatCurrency(category.stats.totalSpent) : '€•••••'}
                </span>
              </div>

              {/* Média Mensal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Média mensal:</span>
                <span className="font-medium text-gray-900">
                  {showBalances ? formatCurrency(category.stats.monthlyAverage) : '€•••••'}
                </span>
              </div>

              {/* Orçamento e Uso */}
              {category.budgetLimit && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Orçamento mensal:</span>
                    <span className="font-medium text-gray-900">
                      {showBalances ? formatCurrency(category.budgetLimit) : '€•••••'}
                    </span>
                  </div>

                  {/* Barra de Progresso do Orçamento */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Uso do orçamento:</span>
                      <span className={`text-xs font-medium ${
                        category.stats.isOverBudget ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {category.stats.budgetUsage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          category.stats.isOverBudget 
                            ? 'bg-red-500' 
                            : category.stats.budgetUsage > 80 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(category.stats.budgetUsage, 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Alerta de Orçamento */}
                  {category.stats.isOverBudget && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-700">
                        Orçamento excedido em {formatCurrency(category.stats.monthlyAverage - category.budgetLimit)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Status da Categoria */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? (
                    <>
                      <Eye className="h-3 w-3" />
                      Ativa
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3" />
                      Inativa
                    </>
                  )}
                </span>
                
                {category.stats.totalSpent > 0 && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    Última atividade
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado Vazio */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma categoria criada
          </h3>
          <p className="text-gray-600 mb-6">
            Crie sua primeira categoria para começar a organizar suas despesas.
          </p>
          <button
            onClick={onAddCategory}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Criar Primeira Categoria
          </button>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza de que deseja excluir esta categoria? Todas as despesas associadas também serão removidas. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};