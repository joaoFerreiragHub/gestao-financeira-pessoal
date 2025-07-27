import { useState } from 'react'
import { 
  Download, Upload, Trash2, BarChart3, Wallet, TrendingUp, TrendingDown, 
 PiggyBank, Eye, EyeOff, Menu, Home, CreditCard, Calculator,
  User, LogOut, Settings, Bell, Search, ChevronRight, Plus
} from 'lucide-react'
import { IncomeSection } from '../../components/financial/income/IncomeSection'
import { ExpenseSection } from '../../components/financial/expenses/ExpenseSection'

// Tipos básicos (mantidos do original)
interface Account {
  id: string
  name: string
  balance: number
  type: 'checking' | 'savings' | 'investment'
}

interface Income {
  id: string
  description: string
  amount: number
  frequency: 'monthly' | 'yearly'
}

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  frequency: 'monthly' | 'yearly'
}

interface Debt {
  id: string
  description: string
  amount: number
  interestRate: number
  monthlyPayment: number
}

interface FinancialState {
  accounts: Account[]
  incomes: Income[]
  expenses: Expense[]
  debts: Debt[]
}

interface FinancialHealthData {
  score: number
  status: string
  savingsRate: number
  debtToAssetRatio: number
  emergencyFundMonths: number
}

// Componente da Sidebar
interface SidebarItemProps {
  icon: React.ElementType
  label: string
  isActive?: boolean
  onClick?: () => void
  hasSubmenu?: boolean
  isExpanded?: boolean
  children?: React.ReactNode
  collapsed?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick, 
  hasSubmenu = false, 
  isExpanded = false, 
  children,
  collapsed = false
}) => {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        } ${collapsed ? 'justify-center px-2' : ''}`}
      >
        <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
          <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
          {!collapsed && <span className="truncate">{label}</span>}
        </div>
        {hasSubmenu && !collapsed && (
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </button>
      
      {hasSubmenu && isExpanded && !collapsed && (
        <div className="mt-1 ml-8 space-y-1">
          {children}
        </div>
      )}
    </div>
  )
}

const SubMenuItem: React.FC<{ label: string; isActive?: boolean; onClick?: () => void }> = ({ 
  label, 
  isActive = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  )
}

export function FinancialManagementPage() {
  // Estados originais
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showBalances, setShowBalances] = useState(true)
  const [financialData, setFinancialData] = useState<FinancialState>({
    accounts: [],
    incomes: [],
    expenses: [],
    debts: []
  })

  // Novos estados para sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState(['contas'])
  const [searchQuery, setSearchQuery] = useState('')

  // Mock user data
  const user = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format',
    plan: 'Premium'
  }

  // Cálculos originais (mantidos)
  const totalBalance = financialData.accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlyIncome = financialData.incomes.reduce((sum, income) => 
    sum + (income.frequency === 'monthly' ? income.amount : income.amount / 12), 0)
  const monthlyExpenses = financialData.expenses.reduce((sum, expense) => 
    sum + (expense.frequency === 'monthly' ? expense.amount : expense.amount / 12), 0)
  const totalDebt = financialData.debts.reduce((sum, debt) => sum + debt.amount, 0)
  const monthlySavings = monthlyIncome - monthlyExpenses
  const netWorth = totalBalance - totalDebt

  // Mock da saúde financeira (mantido)
  const financialHealth: FinancialHealthData = {
    score: 72,
    status: 'Boa',
    savingsRate: monthlyIncome > 0 ? (monthlySavings / monthlyIncome * 100) : 0,
    debtToAssetRatio: totalBalance > 0 ? (totalDebt / totalBalance * 100) : 0,
    emergencyFundMonths: monthlyExpenses > 0 ? (totalBalance / monthlyExpenses) : 0
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  // Menu items para sidebar
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { 
      id: 'contas', 
      label: 'Contas', 
      icon: CreditCard, 
      hasSubmenu: true,
      subItems: [
        { id: 'accounts', label: 'Contas Bancárias' },
        { id: 'cartoes', label: 'Cartões' },
        { id: 'investimentos', label: 'Investimentos' }
      ]
    },
    { id: 'income', label: 'Rendimentos', icon: TrendingUp },
    { id: 'expenses', label: 'Despesas', icon: TrendingDown },
    { id: 'debts', label: 'Dívidas', icon: Calculator },
    { id: 'projections', label: 'Projeções', icon: BarChart3 },
  ]

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const handleMenuClick = (itemId: string, hasSubmenu: boolean = false) => {
    if (hasSubmenu) {
      toggleSubmenu(itemId)
    } else {
      setActiveTab(itemId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      } flex flex-col`}>
        
        {/* Header da Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FinHub</h1>
                  <p className="text-xs text-gray-500">Gestão Financeira</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Perfil do Usuário */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.plan}
              </span>
            </div>
            
            {/* Resumo Rápido */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Patrimônio Líquido</span>
                <button onClick={() => setShowBalances(!showBalances)}>
                  {showBalances ? <Eye className="h-4 w-4 text-gray-500" /> : <EyeOff className="h-4 w-4 text-gray-500" />}
                </button>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {showBalances ? formatCurrency(netWorth) : '•••••'}
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={sidebarCollapsed ? '' : item.label}
              isActive={activeTab === item.id}
              hasSubmenu={item.hasSubmenu}
              isExpanded={expandedMenus.includes(item.id)}
              collapsed={sidebarCollapsed}
              onClick={() => handleMenuClick(item.id, item.hasSubmenu)}
            >
              {item.subItems?.map((subItem) => (
                <SubMenuItem
                  key={subItem.id}
                  label={subItem.label}
                  isActive={activeTab === subItem.id}
                  onClick={() => setActiveTab(subItem.id)}
                />
              ))}
            </SidebarItem>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <SidebarItem
            icon={User}
            label={sidebarCollapsed ? '' : 'Perfil'}
            isActive={activeTab === 'profile'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('profile')}
          />
          <SidebarItem
            icon={Settings}
            label={sidebarCollapsed ? '' : 'Configurações'}
            isActive={activeTab === 'settings'}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('settings')}
          />
          <SidebarItem
            icon={LogOut}
            label={sidebarCollapsed ? '' : 'Sair'}
            collapsed={sidebarCollapsed}
            onClick={() => console.log('Logout')}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'accounts' ? 'Contas Bancárias' :
                 activeTab === 'income' ? 'Rendimentos' :
                 activeTab === 'expenses' ? 'Despesas' :
                 activeTab === 'debts' ? 'Dívidas' :
                 activeTab === 'projections' ? 'Projeções' :
                 activeTab.replace('-', ' ')}
              </h2>
              <p className="text-sm text-gray-600">Gerencie suas finanças de forma inteligente</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Novo Registro
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-blue-700">Patrimônio Líquido</h3>
                    <button
                      onClick={() => setShowBalances(!showBalances)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {showBalances ? formatCurrency(netWorth) : '€****'}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Total de ativos menos dívidas
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-green-700">Receitas Mensais</h3>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(monthlyIncome)}
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {financialData.incomes.length} fonte(s) de renda
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-red-700">Gastos Mensais</h3>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-700">
                    {formatCurrency(monthlyExpenses)}
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    {financialData.expenses.length} despesa(s) registrada(s)
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-purple-700">Economia Mensal</h3>
                    <PiggyBank className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className={`text-2xl font-bold ${monthlySavings >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
                    {formatCurrency(monthlySavings)}
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    {monthlySavings >= 0 ? 'Poupando' : 'Gastando mais que ganha'}
                  </p>
                </div>
              </div>

              {/* Indicador de Saúde Financeira */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Saúde Financeira</h2>
                  <div className="text-sm font-medium text-gray-600">
                    Score: {financialHealth.score}/100
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{financialHealth.status}</p>
                    <p className="text-sm text-gray-600">Status Geral</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {financialHealth.savingsRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Taxa de Poupança</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {financialHealth.debtToAssetRatio.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Endividamento</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {financialHealth.emergencyFundMonths.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">Meses de Reserva</p>
                  </div>
                </div>
              </div>

              {/* Visão Geral e Ações Rápidas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Visão Geral</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Contas bancárias:</span>
                      <span className="font-medium">{financialData.accounts.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Fontes de renda:</span>
                      <span className="font-medium">{financialData.incomes.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Despesas mensais:</span>
                      <span className="font-medium">{financialData.expenses.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dívidas:</span>
                      <span className="font-medium">{financialData.debts.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('income')} 
                      className="w-full flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Adicionar Rendimento
                    </button>
                    <button 
                      onClick={() => setActiveTab('expenses')} 
                      className="w-full flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <TrendingDown className="h-4 w-4" />
                      Registar Despesa
                    </button>
                    <button 
                      onClick={() => setActiveTab('accounts')} 
                      className="w-full flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Wallet className="h-4 w-4" />
                      Nova Conta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== SEÇÃO DE RENDIMENTOS - USANDO O COMPONENTE COMPLETO ===== */}
          {activeTab === 'income' && (
            <IncomeSection 
              showBalances={showBalances} 
              onToggleBalances={() => setShowBalances(!showBalances)}
            />
          )}

          {/* ===== SEÇÃO DE DESPESAS - USANDO O COMPONENTE COMPLETO ===== */}
          {activeTab === 'expenses' && (
            <ExpenseSection 
              showBalances={showBalances} 
              onToggleBalances={() => setShowBalances(!showBalances)}
            />
          )}

          {/* Outras seções mantêm o placeholder por enquanto */}
          {activeTab !== 'dashboard' && activeTab !== 'income' && activeTab !== 'expenses' && (
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seção: {activeTab === 'accounts' ? 'Contas Bancárias' : 
                         activeTab === 'debts' ? 'Dívidas' :
                         activeTab === 'projections' ? 'Projeções' :
                         activeTab.toUpperCase()}
              </h3>
              <p className="text-gray-600 mb-4">
                Esta seção está em desenvolvimento. Aqui você encontrará todas as funcionalidades relacionadas a {
                  activeTab === 'accounts' ? 'contas bancárias' : 
                  activeTab === 'debts' ? 'dívidas' :
                  activeTab === 'projections' ? 'projeções' :
                  activeTab
                }.
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar {activeTab === 'accounts' ? 'Conta' : 
                          activeTab === 'debts' ? 'Dívida' :
                          activeTab === 'projections' ? 'Projeção' :
                          'Item'}
              </button>
            </div>
          )}

          {/* Gestão de Dados */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Gestão de Dados</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" />
                Exportar Dados
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="h-4 w-4" />
                Importar Dados
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 className="h-4 w-4" />
                Limpar Dados
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Exporte regularmente seus dados como backup. Os dados são salvos localmente no seu navegador.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default {
  Page: FinancialManagementPage,
}