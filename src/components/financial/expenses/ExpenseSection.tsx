// src/components/financial/expenses/ExpenseSection.tsx
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  CreditCard, 
  Plus, 
  Eye, 
  EyeOff,
  FileText,
  Settings,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

// Import hooks and components
import { useExpenseData } from './hooks/useExpenseData';
import { useCurrencyFormat } from '../shared/useCurrencyFormat';
import { useDebtExpenseSync } from '../shared/useDebtExpenseSync';
import { ExpenseOverview } from './components/ExpenseOverview';
import { DebtManagement } from './components/DebtManagement';

// Mock debt data - this would come from a debt management system
const mockDebts = [
  {
    id: 'debt-1',
    name: 'Cartão de Crédito Principal',
    type: 'credit_card' as const,
    totalAmount: 5000,
    remainingAmount: 2800,
    monthlyPayment: 150,
    interestRate: 18.5,
    startDate: '2023-01-15',
    isActive: true
  },
  {
    id: 'debt-2',
    name: 'Financiamento Automóvel',
    type: 'loan' as const,
    totalAmount: 25000,
    remainingAmount: 18500,
    monthlyPayment: 320,
    interestRate: 4.2,
    startDate: '2022-06-01',
    isActive: true
  }
];

type TabType = 'overview' | 'categories' | 'transactions' | 'debts' | 'reports';

interface ExpenseSectionProps {
  showBalances?: boolean;
  onToggleBalances?: () => void;
}

export const ExpenseSection: React.FC<ExpenseSectionProps> = ({
  showBalances = true,
  onToggleBalances
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showAddForm, setShowAddForm] = useState(false);

  // Use hooks
  const {
    categories,
    entries,
    stats,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addEntry,
    updateEntry,
    deleteEntry,
    getCategoryExpenses,
    getFixedExpenses,
    getVariableExpenses,
    getDebtExpenses,
    exportData,
    importData,
    clearAllData
  } = useExpenseData();

  const { formatCurrency, formatPercentage, hideValue } = useCurrencyFormat();

  const {
    syncData,
    syncDebtWithExpense,
    createExpenseFromDebt,
    unsyncDebt,
    isSynced,
    getSyncedExpense
  } = useDebtExpenseSync(
    mockDebts,
    entries,
    (newExpense) => addEntry(newExpense),
    (id, updates) => updateEntry(id, updates)
  );

  // Tab configuration
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
      icon: TrendingDown,
      description: 'Gerir categorias de despesas'
    },
    { 
      id: 'transactions' as TabType, 
      label: 'Transações', 
      icon: FileText,
      description: 'Histórico de movimentos'
    },
    { 
      id: 'debts' as TabType, 
      label: 'Sincronização de Dívidas', 
      icon: CreditCard,
      description: 'Integração com pagamentos de dívidas'
    },
    { 
      id: 'reports' as TabType, 
      label: 'Relatórios', 
      icon: FileText,
      description: 'Análises e exportações'
    }
  ];

  // Handle export
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

  // Handle import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importData(content)) {
        alert('Dados importados com sucesso!');
      } else {
        alert('Erro ao importar dados. Verifique o formato do ficheiro.');
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">A carregar despesas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 mb-2">⚠️ Erro</div>
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Recarregar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Despesas</h1>
          <p className="text-gray-600 mt-1">
            Controle as suas despesas fixas, variáveis e pagamentos de dívidas
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {onToggleBalances && (
            <button
              onClick={onToggleBalances}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showBalances ? 'Ocultar' : 'Mostrar'} Valores</span>
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
            
            <label className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Importar</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total de Despesas</p>
              <p className="text-2xl font-bold text-blue-900">
                {hideValue(stats.totalExpenses, showBalances)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Despesas Fixas</p>
              <p className="text-2xl font-bold text-green-900">
                {hideValue(stats.fixedExpenses, showBalances)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Despesas Variáveis</p>
              <p className="text-2xl font-bold text-orange-900">
                {hideValue(stats.variableExpenses, showBalances)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Pagamentos de Dívidas</p>
              <p className="text-2xl font-bold text-red-900">
                {hideValue(stats.debtPayments, showBalances)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <ExpenseOverview
            stats={stats}
            showBalances={showBalances}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Categorias de Despesas</h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Categoria</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => {
                const categoryEntries = getCategoryExpenses(category.id);
                const spent = categoryEntries.reduce((sum, entry) => sum + entry.amount, 0);
                const remaining = category.budget - spent;
                const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;

                return (
                  <div key={category.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center`}>
                          <span className="text-xl">{category.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">{categoryEntries.length} transações</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        category.type === 'fixed' ? 'bg-green-100 text-green-800' :
                        category.type === 'variable' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {category.type === 'fixed' ? 'Fixa' : 
                         category.type === 'variable' ? 'Variável' : 'Dívida'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gasto</span>
                        <span className="font-semibold text-gray-900">
                          {hideValue(spent, showBalances)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Orçamento</span>
                        <span className="font-semibold text-gray-900">
                          {hideValue(category.budget, showBalances)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Restante</span>
                        <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {hideValue(remaining, showBalances)}
                        </span>
                      </div>
                    </div>

                    {category.budget > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progresso</span>
                          <span>{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              percentage > 100 ? 'bg-red-500' : 
                              percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Histórico de Transações</h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Despesa</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entries.map(entry => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {entry.description}
                              </div>
                              {entry.isRecurring && (
                                <div className="text-xs text-blue-600">🔄 Recorrente</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{entry.categoryName}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            entry.type === 'fixed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {entry.type === 'fixed' ? 'Fixa' : 'Variável'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {hideValue(entry.amount, showBalances)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'debts' && (
          <DebtManagement
            debts={mockDebts}
            debtExpenses={getDebtExpenses()}
            syncData={syncData}
            showBalances={showBalances}
            formatCurrency={formatCurrency}
            onSyncDebt={syncDebtWithExpense}
            onCreateExpenseFromDebt={createExpenseFromDebt}
          />
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios e Análises</h3>
              <p className="text-gray-600 mb-6">
                Funcionalidade de relatórios detalhados em desenvolvimento.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <span>Exportar Dados</span>
                </button>
                
                <button
                  onClick={clearAllData}
                  className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Limpar Todos os Dados</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};