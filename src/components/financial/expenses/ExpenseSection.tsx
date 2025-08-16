// src/components/financial/expenses/ExpenseSection.tsx

import React, { useState, useMemo } from 'react';
import { BarChart3, Tag, Calendar, Plus, Eye, EyeOff, TrendingDown, AlertTriangle, PiggyBank } from 'lucide-react';

// Hooks
import { useExpenseData } from './hooks/useExpenseData';
import { useExpenseStats } from './hooks/useExpenseStats';

// Componentes


// Tipos
import { 
  ExpenseEntry, 
  ExpenseCategory, 
  ExpenseFilters as ExpenseFiltersType
} from '../../../types/expenses';
import { ExpenseStatsCard } from './ExpenseStatsCard';
import { ExpenseFilters } from './ExpenseFilters';
import { ExpenseHistory } from './ExpenseHistory';
import { ExpenseCategoryManager } from './ExpenseCategoryManager';
import { ExpenseBudgetManager } from './ExpenseBudgetManager';
import { ExpenseCategoryForm } from './ExpenseCategoryForm';
import { ExpenseEntryForm } from './ExpenseEntryForm';

interface ExpenseSectionProps {
  showBalances: boolean;
  onToggleBalances?: () => void;
}

type TabType = 'overview' | 'categories' | 'history' | 'budget';

export const ExpenseSection: React.FC<ExpenseSectionProps> = ({ 
  showBalances, 
  onToggleBalances 
}) => {
  // Estados
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [editingEntry, setEditingEntry] = useState<ExpenseEntry | null>(null);
  const [filters, setFilters] = useState<ExpenseFiltersType>({
    period: 'all',
    categories: [],
    search: '',
  });

  // Hooks de dados
  const {
    categories,
    entries,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addEntry,
    updateEntry,
    deleteEntry,
    exportData
  } = useExpenseData();

  const { stats } = useExpenseStats(entries, categories);

  // Filtrar entradas baseado nos filtros
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Filtro por período
      if (filters.period !== 'all') {
        const entryDate = new Date(entry.date);
        const now = new Date();
        
        switch (filters.period) {
          case 'thisMonth': {
            if (entryDate.getMonth() !== now.getMonth() || entryDate.getFullYear() !== now.getFullYear()) {
              return false;
            }
            break;
          }
          case 'lastMonth': {
            const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
            const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
            if (entryDate.getMonth() !== lastMonth || entryDate.getFullYear() !== lastMonthYear) {
              return false;
            }
            break;
          }
          case 'thisYear': {
            if (entryDate.getFullYear() !== now.getFullYear()) {
              return false;
            }
            break;
          }
          case 'lastYear': {
            if (entryDate.getFullYear() !== now.getFullYear() - 1) {
              return false;
            }
            break;
          }
          case 'custom': {
            if (filters.dateRange) {
              const entryTime = entryDate.getTime();
              const startTime = filters.dateRange.start ? new Date(filters.dateRange.start).getTime() : 0;
              const endTime = filters.dateRange.end ? new Date(filters.dateRange.end).getTime() : Date.now();
              if (entryTime < startTime || entryTime > endTime) {
                return false;
              }
            }
            break;
          }
        }
      }

      // Filtro por categorias
      if (filters.categories.length > 0 && !filters.categories.includes(entry.categoryId)) {
        return false;
      }

      // Filtro por busca
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          entry.categoryName,
          entry.description || '',
          ...(entry.tags || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Filtro por valor
      if (filters.amountRange) {
        if (filters.amountRange.min !== undefined && entry.amount < filters.amountRange.min) {
          return false;
        }
        if (filters.amountRange.max !== undefined && entry.amount > filters.amountRange.max) {
          return false;
        }
      }

      // Filtro por essencial/não essencial
      if (filters.isEssential !== null && filters.isEssential !== undefined) {
        if (entry.isEssential !== filters.isEssential) {
          return false;
        }
      }

      return true;
    });
  }, [entries, filters]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Handlers
  const handleCategoryFormSubmit = (data: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory(data);
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleExpenseFormSubmit = (data: Omit<ExpenseEntry, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, data);
    } else {
      addEntry(data);
    }
    setShowExpenseForm(false);
    setEditingEntry(null);
  };

  const handleEditCategory = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleEditEntry = (entry: ExpenseEntry) => {
    setEditingEntry(entry);
    setShowExpenseForm(true);
  };

  const handleExport = () => {
    const dataStr = exportData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `despesas-${new Date().toISOString().split('T')[0]}.json`;
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
      icon: BarChart3,
      description: 'Resumo e estatísticas gerais'
    },
    { 
      id: 'categories' as TabType, 
      label: 'Categorias', 
      icon: Tag,
      description: 'Gerencie suas categorias de despesas'
    },
    { 
      id: 'history' as TabType, 
      label: 'Histórico', 
      icon: Calendar,
      description: 'Histórico completo de despesas'
    },
    { 
      id: 'budget' as TabType, 
      label: 'Orçamento', 
      icon: PiggyBank,
      description: 'Controle e análise de orçamento'
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
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Despesas</h2>
          <p className="text-gray-600">
            Controle e acompanhe todas as suas despesas de forma organizada
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
      <ExpenseStatsCard 
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
                    ? 'border-red-500 text-red-600'
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
          <ExpenseFilters 
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />

          {/* Ações Rápidas */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCategoryForm(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </button>
            <button
              onClick={() => setShowExpenseForm(true)}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </button>
          </div>

          {/* Análise Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Evolução */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Evolução Mensal de Gastos</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingDown className="h-12 w-12 text-red-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Gráfico em desenvolvimento</p>
                  <p className="text-gray-400 text-xs">Mostrará evolução das despesas</p>
                </div>
              </div>
            </div>

            {/* Distribuição por Categoria */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Gastos por Categoria</h3>
              <div className="space-y-3">
                {stats.byCategory.slice(0, 6).map((categoryData) => {
                  const category = categories.find(c => c.id === categoryData.categoryId);
                  return (
                    <div key={categoryData.categoryId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{category?.icon || '📦'}</span>
                        <span className="font-medium text-gray-900">{categoryData.categoryName}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {showBalances ? formatCurrency(categoryData.total) : '€•••••'}
                        </p>
                        <p className="text-sm text-gray-500">{categoryData.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
                {stats.byCategory.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma despesa registrada este ano
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Análise Detalhada */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Análise de Gastos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{categories.length}</p>
                <p className="text-sm text-gray-600">Categorias Ativas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{entries.length}</p>
                <p className="text-sm text-gray-600">Despesas Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{filteredEntries.length}</p>
                <p className="text-sm text-gray-600">Filtradas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {showBalances ? formatCurrency(stats.averageMonthly) : '€•••••'}
                </p>
                <p className="text-sm text-gray-600">Média Mensal</p>
              </div>
            </div>
          </div>

          {/* Histórico Recente */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Despesas Recentes</h3>
            </div>
            <ExpenseHistory 
              entries={filteredEntries.slice(0, 10)}
              categories={categories}
              showBalances={showBalances}
              onEditEntry={handleEditEntry}
              onDeleteEntry={deleteEntry}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <ExpenseCategoryManager
          categories={categories}
          entries={entries}
          showBalances={showBalances}
          onAddCategory={() => setShowCategoryForm(true)}
          onEditCategory={handleEditCategory}
          onDeleteCategory={deleteCategory}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <ExpenseFilters 
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Histórico Completo ({filteredEntries.length} despesas)
            </h3>
            <button
              onClick={() => setShowExpenseForm(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </button>
          </div>

          <ExpenseHistory 
            entries={filteredEntries}
            categories={categories}
            showBalances={showBalances}
            onEditEntry={handleEditEntry}
            onDeleteEntry={deleteEntry}
            formatCurrency={formatCurrency}
          />
        </div>
      )}

      {activeTab === 'budget' && (
        <ExpenseBudgetManager
          categories={categories}
          stats={stats}
          showBalances={showBalances}
          onEditCategory={handleEditCategory}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Modais */}
      {showCategoryForm && (
        <ExpenseCategoryForm
          category={editingCategory}
          onSubmit={handleCategoryFormSubmit}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {showExpenseForm && (
        <ExpenseEntryForm
          entry={editingEntry}
          categories={categories}
          onSubmit={handleExpenseFormSubmit}
          onCancel={() => {
            setShowExpenseForm(false);
            setEditingEntry(null);
          }}
        />
      )}
    </div>
  );
};