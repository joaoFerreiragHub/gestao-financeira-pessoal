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
            Controle e acompanhe todos os seus gastos de forma organizada
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onToggleBalances && (
            <button
              onClick={onToggleBalances}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={showBalances ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {showBalances ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          )}
          <button
            onClick={() => setShowCategoryForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Categoria
          </button>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Despesa
          </button>
        </div>
      </div>

      {/* Estatísticas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Este Mês */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold mb-4">Nova Despesa</h3>
            <p className="text-gray-600 mb-4">Formulário de despesa em desenvolvimento...</p>
            <button
              onClick={() => setShowExpenseForm(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};sm font-medium text-red-700">Gastos Este Mês</h3>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700">
            {showBalances ? formatCurrency(stats.totalThisMonth) : '€•••••'}
          </p>
          <div className="flex items-center mt-1">
            <span className={`text-xs ${stats.growth.monthly >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.growth.monthly >= 0 ? '+' : ''}{stats.growth.monthly.toFixed(1)}% vs mês anterior
            </span>
          </div>
        </div>

        {/* Total Este Ano */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-700">Gastos Este Ano</h3>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {showBalances ? formatCurrency(stats.totalThisYear) : '€•••••'}
          </p>
          <p className="text-xs text-blue-600 mt-1">{entries.length} despesas registradas</p>
        </div>

        {/* Orçamento */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-700">Orçamento Usado</h3>
            <PiggyBank className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {stats.budgetStatus.percentageUsed.toFixed(1)}%
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {showBalances ? formatCurrency(stats.budgetStatus.remaining) : '€•••••'} restante
          </p>
        </div>

        {/* Essencial vs Não Essencial */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-amber-700">Gastos Essenciais</h3>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700">
            {stats.essentialVsNonEssential.essentialPercentage.toFixed(1)}%
          </p>
          <p className="text-xs text-amber-600 mt-1">
            {showBalances ? formatCurrency(stats.essentialVsNonEssential.essential) : '€•••••'} em essenciais
          </p>
        </div>
      </div>

      {/* Navegação por Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Evolução */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Evolução Mensal de Gastos</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Gráfico em desenvolvimento</p>
                  <p className="text-gray-400 text-xs">Mostrará evolução das despesas</p>
                </div>
              </div>
            </div>

            {/* Distribuição por Categoria */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Gastos por Categoria</h3>
              <div className="space-y-3">
                {stats.byCategory.slice(0, 6).map((categoryData, index) => {
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
        </div>
      )}

      {/* Outras tabs com placeholders por enquanto */}
      {activeTab !== 'overview' && (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Seção: {activeTab === 'categories' ? 'Gestão de Categorias' : 
                     activeTab === 'history' ? 'Histórico de Despesas' :
                     activeTab === 'budget' ? 'Controle de Orçamento' :
                     activeTab.toUpperCase()}
          </h3>
          <p className="text-gray-600 mb-4">
            Esta seção está em desenvolvimento. Aqui você encontrará todas as funcionalidades relacionadas a {
              activeTab === 'categories' ? 'gestão de categorias' : 
              activeTab === 'history' ? 'histórico de despesas' :
              activeTab === 'budget' ? 'controle de orçamento' :
              activeTab
            }.
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Em Breve
          </button>
        </div>
      )}

      {/* Modais - Placeholders por enquanto */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Nova Categoria</h3>
            <p className="text-gray-600 mb-4">Formulário de categoria em desenvolvimento...</p>
            <button
              onClick={() => setShowCategoryForm(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-// src/components/expenses/ExpenseSection.tsx

import React, { useState, useMemo } from 'react';
import { BarChart3, Tag, Calendar, Plus, Eye, EyeOff, TrendingDown, AlertTriangle, PiggyBank } from 'lucide-react';

// Hooks
import { useExpenseData } from '../../hooks/useExpenseData';
import { useExpenseStats } from '../../hooks/useExpenseStats';

// Tipos
import { 
  ExpenseEntry, 
  ExpenseCategory, 
  ExpenseFilters
} from '../../types/expenses';

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
  const [filters, setFilters] = useState<ExpenseFilters>({
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
        if (filters.amountRange.min && entry.amount < filters.amountRange.min) {
          return false;
        }
        if (filters.amountRange.max && entry.amount > filters.amountRange.max) {
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
  const handleCategoryFormSubmit = (data: Omit<ExpenseCategory, 'id' | 'cre