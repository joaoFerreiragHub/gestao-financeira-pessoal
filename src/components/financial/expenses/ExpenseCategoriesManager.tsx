import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Tag, 
  CreditCard, 
  Home, 
  Car, 
  ShoppingCart, 
  Coffee, 
  Zap, 
  TrendingDown,
  Target,

} from 'lucide-react';
import { useDebtExpenseSync } from '../shared/useDebtExpenseSync';
import { ExpenseCategory, ExpenseEntry } from '../../../types/financial/expenses';
import { CategoryCard } from './CategoryCard';

interface ExpenseCategoriesManagerProps {
  showBalances?: boolean;
  onToggleBalances?: () => void;
}

export const ExpenseCategoriesManager: React.FC<ExpenseCategoriesManagerProps> = ({
  showBalances = true,
  onToggleBalances
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'categories' | 'debts'>('overview');
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Hook para sincronização com dívidas
  const { debtPayments, debts, syncDebtWithExpense } = useDebtExpenseSync();

  // Categorias padrão
  const defaultCategories: ExpenseCategory[] = [
    { id: 'housing', name: 'Habitação', icon: '🏠', color: 'bg-blue-500', budget: 1200, type: 'fixed', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'food', name: 'Alimentação', icon: '🛒', color: 'bg-green-500', budget: 400, type: 'variable', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'transport', name: 'Transporte', icon: '🚗', color: 'bg-orange-500', budget: 300, type: 'variable', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'utilities', name: 'Utilidades', icon: '⚡', color: 'bg-yellow-500', budget: 150, type: 'fixed', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'entertainment', name: 'Entretenimento', icon: '☕', color: 'bg-purple-500', budget: 200, type: 'variable', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'debts', name: 'Dívidas', icon: '💳', color: 'bg-red-500', budget: 500, type: 'debt', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

  // Mock data
  useEffect(() => {
    setCategories(defaultCategories);
    setExpenses([
      { 
        id: '1', 
        description: 'Renda do Apartamento', 
        amount: 650, 
        categoryId: 'housing', 
        categoryName: 'Habitação',
        date: '2024-01-15', 
        type: 'fixed',
        isRecurring: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        description: 'Supermercado Continente', 
        amount: 85.50, 
        categoryId: 'food', 
        categoryName: 'Alimentação',
        date: '2024-01-14',
        type: 'variable',
        isRecurring: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '3', 
        description: 'Combustível', 
        amount: 45.00, 
        categoryId: 'transport', 
        categoryName: 'Transporte',
        date: '2024-01-13',
        type: 'variable',
        isRecurring: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '4', 
        description: 'Pagamento Crédito Habitação', 
        amount: 420, 
        categoryId: 'debts', 
        categoryName: 'Dívidas',
        date: '2024-01-15', 
        type: 'fixed',
        isRecurring: true,
        debtId: 'debt1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '5', 
        description: 'Netflix', 
        amount: 15.99, 
        categoryId: 'entertainment', 
        categoryName: 'Entretenimento',
        date: '2024-01-12', 
        type: 'fixed',
        isRecurring: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  }, []);

  // Utilitários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const getCategoryExpenses = (categoryId: string) => {
    return expenses.filter(expense => expense.categoryId === categoryId);
  };

  const getCategoryTotal = (categoryId: string) => {
    return getCategoryExpenses(categoryId).reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getDebtExpenses = () => {
    return expenses.filter(expense => expense.debtId);
  };

  // Navegação
  const NavigationTabs = () => (
    <div className="bg-white rounded-xl p-2 border border-gray-200 mb-6">
      <div className="flex space-x-1">
        {[
          { id: 'overview', label: 'Visão Geral', icon: Tag },
          { id: 'categories', label: 'Gerir Categorias', icon: Edit3 },
          { id: 'debts', label: 'Sincronização Dívidas', icon: CreditCard }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === tab.id
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão Avançada de Categorias</h2>
          <p className="text-gray-600">
            Organize suas despesas por categorias e mantenha dívidas sincronizadas
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onToggleBalances && (
            <button
              onClick={onToggleBalances}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={showBalances ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {showBalances ? '👁️' : '🙈'}
            </button>
          )}
        </div>
      </div>

      <NavigationTabs />

      {/* Conteúdo baseado na view ativa */}
      {activeView === 'overview' && (
        <div className="space-y-8">
          {/* Resumo Geral */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Tag className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold">Categorias</h3>
                  <p className="text-blue-100 text-sm">Ativas no sistema</p>
                </div>
              </div>
              <p className="text-3xl font-bold">{categories.length}</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingDown className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold">Total Gasto</h3>
                  <p className="text-green-100 text-sm">Este mês</p>
                </div>
              </div>
              <p className="text-3xl font-bold">
                {showBalances ? formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0)) : '••••••'}
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold">Orçamento Total</h3>
                  <p className="text-orange-100 text-sm">Definido</p>
                </div>
              </div>
              <p className="text-3xl font-bold">
                {showBalances ? formatCurrency(categories.reduce((sum, cat) => sum + cat.budget, 0)) : '••••••'}
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold">Pagamentos Dívidas</h3>
                  <p className="text-red-100 text-sm">Este mês</p>
                </div>
              </div>
              <p className="text-3xl font-bold">
                {showBalances ? formatCurrency(getDebtExpenses().reduce((sum, exp) => sum + exp.amount, 0)) : '••••••'}
              </p>
            </div>
          </div>

          {/* Grid de Categorias */}
          <div>
            <div className="flex items-center justify-between mb-6">
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
              {categories.map(category => (
                <CategoryCard 
                  key={category.id} 
                  category={category}
                  expenses={getCategoryExpenses(category.id)}
                  showBalances={showBalances}
                  formatCurrency={formatCurrency}
                  debts={category.isDebtCategory ? debts : []}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'debts' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-900">Sincronização com Dívidas</h2>
            </div>
            <p className="text-blue-800 mb-4">
              Os pagamentos das suas dívidas são automaticamente categorizados como "Dívidas". 
              Pode adicionar/editar tanto aqui como na tab dedicada às Dívidas.
            </p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Ir para Tab Dívidas
              </button>
              <button className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                Adicionar Pagamento
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {debts.map(debt => (
              <div key={debt.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{debt.name}</h4>
                    <p className="text-sm text-gray-600">
                      {debt.remainingMonths} meses restantes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {showBalances ? formatCurrency(debt.monthlyPayment) : '••••••'}
                    </p>
                    <p className="text-xs text-gray-500">por mês</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total em dívida:</span>
                    <p className="font-semibold text-red-600">
                      {showBalances ? formatCurrency(debt.totalAmount) : '••••••'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Taxa de juro:</span>
                    <p className="font-semibold text-gray-900">{debt.interestRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'categories' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gerir Categorias</h2>
          <p className="text-gray-600 mb-6">
            Adicione, edite ou remova categorias de despesas. A categoria "Dívidas" é especial e sincroniza automaticamente.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
            <p className="text-gray-600">
              Interface de gestão de categorias será implementada em breve
            </p>
          </div>
        </div>
      )}
    </div>
  );
};