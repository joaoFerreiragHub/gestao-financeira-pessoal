// src/components/financial/debts/DebtSection.tsx

import React, { useState, useMemo } from 'react';
import { Calculator, CreditCard, Calendar, Plus, Eye, EyeOff, TrendingDown, AlertTriangle, Target } from 'lucide-react';

// Hooks
import { useDebtData } from './hooks/useDebtData';
import { useDebtStats } from './hooks/useDebtStats';

// Componentes
import { DebtStatsCard } from './DebtStatsCard';
import { DebtCategoryManager } from './DebtCategoryManager';
import { DebtHistory } from './DebtHistory';
import { DebtFilters } from './DebtFilters';
import { DebtCategoryForm } from './DebtCategoryForm';
import { DebtEntryForm } from './DebtEntryForm';
import { DebtPaymentManager } from './DebtPaymentManager';
import { DebtStrategyManager } from './DebtStrategyManager';

// Tipos
import { 
  DebtEntry, 
  DebtCategory, 
  DebtFilters as DebtFiltersType
} from '../../../types/debts';

interface DebtSectionProps {
  showBalances: boolean;
  onToggleBalances?: () => void;
}

type TabType = 'overview' | 'categories' | 'history' | 'payments' | 'strategy';

export const DebtSection: React.FC<DebtSectionProps> = ({ 
  showBalances, 
  onToggleBalances 
}) => {
  // Estados
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DebtCategory | null>(null);
  const [editingDebt, setEditingDebt] = useState<DebtEntry | null>(null);
  const [filters, setFilters] = useState<DebtFiltersType>({
    period: 'all',
    categories: [],
    search: '',
  });

  // Hooks de dados
  const {
    categories,
    debts,
    payments,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addDebt,
    updateDebt,
    deleteDebt,
    addPayment,
    updatePayment,
    deletePayment,
    exportData
  } = useDebtData();

  const { stats } = useDebtStats(debts, categories, payments);

  // Filtrar dívidas baseado nos filtros
  const filteredDebts = useMemo(() => {
    return debts.filter(debt => {
      // Filtro por período (baseado na data de vencimento)
      if (filters.period !== 'all') {
        const dueDate = new Date(debt.dueDate);
        const now = new Date();
        
        switch (filters.period) {
          case 'thisMonth': {
            if (dueDate.getMonth() !== now.getMonth() || dueDate.getFullYear() !== now.getFullYear()) {
              return false;
            }
            break;
          }
          case 'lastMonth': {
            const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
            const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
            if (dueDate.getMonth() !== lastMonth || dueDate.getFullYear() !== lastMonthYear) {
              return false;
            }
            break;
          }
          case 'thisYear': {
            if (dueDate.getFullYear() !== now.getFullYear()) {
              return false;
            }
            break;
          }
          case 'lastYear': {
            if (dueDate.getFullYear() !== now.getFullYear() - 1) {
              return false;
            }
            break;
          }
          case 'custom': {
            if (filters.dateRange) {
              const dueTime = dueDate.getTime();
              const startTime = filters.dateRange.start ? new Date(filters.dateRange.start).getTime() : 0;
              const endTime = filters.dateRange.end ? new Date(filters.dateRange.end).getTime() : Date.now();
              if (dueTime < startTime || dueTime > endTime) {
                return false;
              }
            }
            break;
          }
        }
      }

      // Filtro por categorias
      if (filters.categories.length > 0 && !filters.categories.includes(debt.categoryId)) {
        return false;
      }

      // Filtro por busca
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          debt.categoryName,
          debt.creditorName,
          debt.description || '',
          ...(debt.tags || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Filtro por valor
      if (filters.amountRange) {
        if (filters.amountRange.min !== undefined && debt.currentBalance < filters.amountRange.min) {
          return false;
        }
        if (filters.amountRange.max !== undefined && debt.currentBalance > filters.amountRange.max) {
          return false;
        }
      }

      // Filtro por prioridade
      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(debt.priority)) {
        return false;
      }

      // Filtro por tipo de dívida
      if (filters.debtType && filters.debtType.length > 0 && !filters.debtType.includes(debt.debtType)) {
        return false;
      }

      // Filtro por status ativo
      if (filters.isActive !== null && filters.isActive !== undefined) {
        if (debt.isActive !== filters.isActive) {
          return false;
        }
      }

      return true;
    });
  }, [debts, filters]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Handlers
  const handleCategoryFormSubmit = (data: Omit<DebtCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory(data);
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleDebtFormSubmit = (data: Omit<DebtEntry, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>) => {
    if (editingDebt) {
      updateDebt(editingDebt.id, data);
    } else {
      addDebt(data);
    }
    setShowDebtForm(false);
    setEditingDebt(null);
  };

  const handleEditCategory = (category: DebtCategory) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleEditDebt = (debt: DebtEntry) => {
    setEditingDebt(debt);
    setShowDebtForm(true);
  };

  const handleExport = () => {
    const dataStr = exportData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dividas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Configuração das tabs
  const tabs = [
    { 
      id: 'overview' as TabType, 
      label: 'Visão Geral', 
      icon: Calculator,
      description: 'Resumo e estatísticas gerais'
    },
    { 
      id: 'categories' as TabType, 
      label: 'Categorias', 
      icon: CreditCard,
      description: 'Gerencie tipos de dívidas'
    },
    { 
      id: 'history' as TabType, 
      label: 'Dívidas', 
      icon: Calendar,
      description: 'Gestão completa de dívidas'
    },
    { 
      id: 'payments' as TabType, 
      label: 'Pagamentos', 
      icon: TrendingDown,
      description: 'Histórico de pagamentos'
    },
    { 
      id: 'strategy' as TabType, 
      label: 'Estratégias', 
      icon: Target,
      description: 'Planos de quitação'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Dívidas</h2>
          <p className="text-gray-600">
            Controle suas dívidas e acelere a quitação de forma estratégica
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onToggleBalances && (
            <button
              onClick={onToggleBalances}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={showBalances ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {showBalances ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Exportar Dados
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <DebtStatsCard 
        stats={stats} 
        showBalances={showBalances}
        formatCurrency={formatCurrency}
      />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Filtros */}
          <DebtFilters 
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />

          {/* Ações Rápidas */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCategoryForm(true)}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </button>
            <button
              onClick={() => setShowDebtForm(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Dívida
            </button>
          </div>

          {/* Análise Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Distribuição */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribuição por Categoria</h3>
              <div className="space-y-3">
                {stats.byCategory.slice(0, 6).map((categoryData) => {
                  const category = categories.find(c => c.id === categoryData.categoryId);
                  return (
                    <div key={categoryData.categoryId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category?.icon || '📄'}</span>
                        <div>
                          <span className="font-medium text-gray-900">{categoryData.categoryName}</span>
                          <p className="text-xs text-gray-500">{categoryData.averageRate.toFixed(1)}% taxa média</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {showBalances ? formatCurrency(categoryData.totalDebt) : '€•••••'}
                        </p>
                        <p className="text-sm text-gray-500">{categoryData.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
                {stats.byCategory.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma dívida registrada
                  </p>
                )}
              </div>
            </div>

            {/* Progresso de Quitação */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Projeção de Quitação</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.payoffProjection.months}
                  </p>
                  <p className="text-sm text-gray-600">meses para quitar</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {showBalances ? formatCurrency(stats.payoffProjection.totalInterest) : '€•••••'}
                    </p>
                    <p className="text-xs text-gray-600">Total de juros</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {stats.debtFreeDate ? new Date(stats.debtFreeDate).toLocaleDateString('pt-PT') : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">Data livre de dívidas</p>
                  </div>
                </div>

                {stats.debtToIncomeRatio > 40 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Ratio Dívida/Renda Alto</p>
                      <p className="text-xs text-red-700">
                        {stats.debtToIncomeRatio.toFixed(1)}% - Recomendado abaixo de 36%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dívidas Recentes */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Dívidas Ativas</h3>
            </div>
            <DebtHistory 
              debts={filteredDebts.slice(0, 10)}
              categories={categories}
              showBalances={showBalances}
              onEditDebt={handleEditDebt}
              onDeleteDebt={deleteDebt}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <DebtCategoryManager
          categories={categories}
          debts={debts}
          showBalances={showBalances}
          onAddCategory={() => setShowCategoryForm(true)}
          onEditCategory={handleEditCategory}
          onDeleteCategory={deleteCategory}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <DebtFilters 
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Todas as Dívidas ({filteredDebts.length})
            </h3>
            <button
              onClick={() => setShowDebtForm(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Dívida
            </button>
          </div>

          <DebtHistory 
            debts={filteredDebts}
            categories={categories}
            showBalances={showBalances}
            onEditDebt={handleEditDebt}
            onDeleteDebt={deleteDebt}
            formatCurrency={formatCurrency}
          />
        </div>
      )}

      {activeTab === 'payments' && (
        <DebtPaymentManager
          debts={debts}
          payments={payments}
          showBalances={showBalances}
          onAddPayment={addPayment}
          onEditPayment={updatePayment}
          onDeletePayment={deletePayment}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'strategy' && (
        <DebtStrategyManager
          debts={debts}
          stats={stats}
          showBalances={showBalances}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Modais */}
      {showCategoryForm && (
        <DebtCategoryForm
          category={editingCategory}
          onSubmit={handleCategoryFormSubmit}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {showDebtForm && (
        <DebtEntryForm
          debt={editingDebt}
          categories={categories}
          onSubmit={handleDebtFormSubmit}
          onCancel={() => {
            setShowDebtForm(false);
            setEditingDebt(null);
          }}
        />
      )}
    </div>
  );
};