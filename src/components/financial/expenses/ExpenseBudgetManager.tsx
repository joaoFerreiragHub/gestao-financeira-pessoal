// src/components/financial/expenses/ExpenseBudgetManager.tsx

import React, { useState } from 'react';
import { PiggyBank, AlertTriangle, TrendingUp, TrendingDown, Edit, Target, BarChart3 } from 'lucide-react';
import { ExpenseCategory, ExpenseStats } from '../../../types/expenses';

interface ExpenseBudgetManagerProps {
  categories: ExpenseCategory[];
  stats: ExpenseStats;
  showBalances: boolean;
  onEditCategory: (category: ExpenseCategory) => void;
  formatCurrency: (amount: number) => string;
}

export const ExpenseBudgetManager: React.FC<ExpenseBudgetManagerProps> = ({
  categories,
  stats,
  showBalances,
  onEditCategory,
  formatCurrency,
}) => {
  const [viewMode, setViewMode] = useState<'overview' | 'categories'>('overview');
  const [sortBy, setSortBy] = useState<'usage' | 'remaining' | 'name'>('usage');

  // Calcular dados do orçamento por categoria
  const categoriesWithBudget = categories
    .filter(cat => cat.budgetLimit && cat.budgetLimit > 0)
    .map(category => {
      const categoryStats = stats.byCategory.find(stat => stat.categoryId === category.id);
      const spent = categoryStats?.total || 0;
      const monthlySpent = spent / 12; // Aproximação baseada no ano
      const budgetUsage = category.budgetLimit ? (monthlySpent / category.budgetLimit) * 100 : 0;
      const remaining = (category.budgetLimit || 0) - monthlySpent;
      const isOverBudget = budgetUsage > 100;
      
      return {
        ...category,
        spent: monthlySpent,
        budgetUsage,
        remaining,
        isOverBudget,
        categoryStats,
      };
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return b.budgetUsage - a.budgetUsage;
        case 'remaining':
          return a.remaining - b.remaining;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categoriesWithoutBudget = categories.filter(cat => !cat.budgetLimit || cat.budgetLimit <= 0);

  const getBudgetStatusColor = (usage: number) => {
    if (usage > 100) return 'text-red-600';
    if (usage > 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBudgetBarColor = (usage: number) => {
    if (usage > 100) return 'bg-red-500';
    if (usage > 80) return 'bg-yellow-500';
    return 'bg-green-500';
    };
    
    type SortBy = 'usage' | 'remaining' | 'name';
    const getProgressBarWidth = (usage: number) => {
        return Math.min(usage, 100);
    };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Controle de Orçamento</h3>
          <p className="text-gray-600">
            Acompanhe seus limites de gastos e mantenha o controle financeiro
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
           onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="usage">Ordenar por Uso</option>
            <option value="remaining">Ordenar por Restante</option>
            <option value="name">Ordenar por Nome</option>
          </select>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'overview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setViewMode('categories')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'categories'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Por Categoria
            </button>
          </div>
        </div>
      </div>

      {/* Visão Geral */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Resumo Geral do Orçamento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orçamento Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {showBalances ? formatCurrency(stats.budgetStatus.totalBudget / 12) : '€•••••'}
                  </p>
                  <p className="text-sm text-gray-500">Por mês</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gasto Este Ano</p>
                  <p className="text-2xl font-bold text-red-600">
                    {showBalances ? formatCurrency(stats.budgetStatus.totalSpent) : '€•••••'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stats.budgetStatus.percentageUsed.toFixed(1)}% do orçamento anual
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Restante</p>
                  <p className={`text-2xl font-bold ${
                    stats.budgetStatus.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {showBalances ? formatCurrency(stats.budgetStatus.remaining) : '€•••••'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stats.budgetStatus.remaining >= 0 ? 'Dentro do orçamento' : 'Orçamento excedido'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stats.budgetStatus.remaining >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {stats.budgetStatus.remaining >= 0 ? (
                    <TrendingDown className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Progresso Geral */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Progresso do Orçamento Anual</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilização:</span>
                <span className={`text-sm font-medium ${getBudgetStatusColor(stats.budgetStatus.percentageUsed)}`}>
                  {stats.budgetStatus.percentageUsed.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getBudgetBarColor(stats.budgetStatus.percentageUsed)}`}
                  style={{ width: `${getProgressBarWidth(stats.budgetStatus.percentageUsed)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>€0</span>
                <span>{showBalances ? formatCurrency(stats.budgetStatus.totalBudget) : '€•••••'}</span>
              </div>
            </div>
          </div>

          {/* Categorias Críticas */}
          {categoriesWithBudget.filter(cat => cat.isOverBudget || cat.budgetUsage > 80).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h4 className="text-lg font-semibold text-red-900">Categorias Que Precisam de Atenção</h4>
              </div>
              <div className="space-y-3">
                {categoriesWithBudget
                  .filter(cat => cat.isOverBudget || cat.budgetUsage > 80)
                  .slice(0, 3)
                  .map(category => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-600">
                            {category.isOverBudget ? 'Orçamento excedido' : 'Próximo do limite'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${getBudgetStatusColor(category.budgetUsage)}`}>
                          {category.budgetUsage.toFixed(1)}%
                        </p>
                        <button
                          onClick={() => onEditCategory(category)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Ajustar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visão por Categorias */}
      {viewMode === 'categories' && (
        <div className="space-y-6">
          {/* Categorias com Orçamento */}
          {categoriesWithBudget.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                Categorias com Orçamento ({categoriesWithBudget.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoriesWithBudget.map((category) => (
                  <div key={category.id} className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                          <span className="text-xl">{category.icon}</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{category.name}</h5>
                          <p className="text-sm text-gray-600">
                            Limite: {showBalances ? formatCurrency(category.budgetLimit || 0) : '€•••••'}/mês
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onEditCategory(category)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Gasto médio mensal:</span>
                        <span className="font-medium text-gray-900">
                          {showBalances ? formatCurrency(category.spent) : '€•••••'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Restante:</span>
                        <span className={`font-medium ${
                          category.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {showBalances ? formatCurrency(category.remaining) : '€•••••'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Utilização:</span>
                          <span className={`text-xs font-medium ${getBudgetStatusColor(category.budgetUsage)}`}>
                            {category.budgetUsage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getBudgetBarColor(category.budgetUsage)}`}
                            style={{ width: `${getProgressBarWidth(category.budgetUsage)}%` }}
                          />
                        </div>
                      </div>

                      {category.isOverBudget && (
                        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-red-700">
                            Excedeu em {formatCurrency(Math.abs(category.remaining))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorias sem Orçamento */}
          {categoriesWithoutBudget.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                Categorias sem Orçamento ({categoriesWithoutBudget.length})
              </h4>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriesWithoutBudget.map((category) => {
                    const categoryStats = stats.byCategory.find(stat => stat.categoryId === category.id);
                    return (
                      <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{category.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-sm text-gray-600">
                              Gasto: {showBalances ? formatCurrency(categoryStats?.total || 0) : '€•••••'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onEditCategory(category)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Definir orçamento"
                        >
                          <Target className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium text-blue-900">Dica:</p>
                  </div>
                  <p className="text-sm text-blue-800 mt-1">
                    Defina orçamentos para essas categorias para ter melhor controle dos seus gastos.
                    Clique no ícone de alvo para configurar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Estado Vazio */}
          {categoriesWithBudget.length === 0 && categoriesWithoutBudget.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-gray-600">
                Crie algumas categorias primeiro para poder definir orçamentos.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Insights e Recomendações */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Insights e Recomendações</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Insight 1: Categorias sem orçamento */}
          {categoriesWithoutBudget.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Categorias sem controle</p>
                <p className="text-sm text-gray-600">
                  {categoriesWithoutBudget.length} categoria{categoriesWithoutBudget.length !== 1 ? 's' : ''} 
                  {categoriesWithoutBudget.length !== 1 ? ' não têm' : ' não tem'} orçamento definido.
                </p>
              </div>
            </div>
          )}

          {/* Insight 2: Situação geral do orçamento */}
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              stats.budgetStatus.percentageUsed > 100 ? 'bg-red-100' :
              stats.budgetStatus.percentageUsed > 80 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              {stats.budgetStatus.percentageUsed > 100 ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : stats.budgetStatus.percentageUsed > 80 ? (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {stats.budgetStatus.percentageUsed > 100 ? 'Orçamento excedido' :
                 stats.budgetStatus.percentageUsed > 80 ? 'Atenção ao orçamento' :
                 'Orçamento sob controle'}
              </p>
              <p className="text-sm text-gray-600">
                {stats.budgetStatus.percentageUsed > 100 ? 
                  'Considere revisar seus gastos ou aumentar o orçamento.' :
                 stats.budgetStatus.percentageUsed > 80 ?
                  'Você está próximo do limite. Monitore os gastos.' :
                  'Continue assim! Seus gastos estão dentro do planejado.'}
              </p>
            </div>
          </div>

          {/* Insight 3: Despesas essenciais vs supérfluas */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Proporção de gastos</p>
              <p className="text-sm text-gray-600">
                {stats.essentialVsNonEssential.essentialPercentage.toFixed(0)}% dos gastos são essenciais.
                {stats.essentialVsNonEssential.essentialPercentage < 60 && 
                  ' Considere reduzir gastos supérfluos.'}
              </p>
            </div>
          </div>

          {/* Insight 4: Crescimento dos gastos */}
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              stats.growth.yearly > 10 ? 'bg-red-100' : 
              stats.growth.yearly > 0 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              {stats.growth.yearly > 0 ? (
                <TrendingUp className={`h-5 w-5 ${
                  stats.growth.yearly > 10 ? 'text-red-600' : 'text-yellow-600'
                }`} />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">Tendência anual</p>
              <p className="text-sm text-gray-600">
                {stats.growth.yearly > 0 ? 'Aumento' : 'Redução'} de {Math.abs(stats.growth.yearly).toFixed(1)}% 
                em relação ao ano anterior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};