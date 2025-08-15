import { useState, useEffect, useMemo } from 'react'
import { Bell, Plus, Menu } from 'lucide-react'

// Componentes melhorados
import { EnhancedSidebar } from '../../components/layout/EnhancedSidebar'
import { QuickActionButton } from '../../components/layout/QuickActionButton'
import { NotificationBell } from '../../components/layout/NotificationBell'
import { QuickFeedback } from '../../components/ui/QuickFeedback'

// Componentes existentes
import { IncomeSection } from '../../components/financial/income/IncomeSection'
import { ExpenseSection } from '../../components/financial/expenses/ExpenseSection'
import { AccountSection } from '../../components/financial/accounts/AccountSection'
import { ReportsSection } from '../../components/financial/reports/ReportsSection'
import { GoalsSection } from '../../components/financial/goals/GoalsSection'
import { DebtSection } from '../../components/financial/debts/DebtSection'

// Tipos consolidados
import type {
  FinancialState,
  User,
  FinancialSummary,
  MetricsData,
  QuickActionsData,
} from '../../types/financial'

// Utilitários de cálculo
import {
  calculateTotalBalance,
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
  calculateTotalDebt,
  calculateMonthlySavings,
  calculateNetWorth,
  calculateFinancialHealth
} from '../../types/financial'
import { QuickActions } from '../../components/financial/Dashboard/QuickActions'
import { LoadingSpinner, SkeletonDashboard } from '../../components/ui/LoadingSpinner'
import { MetricGrid } from '../../components/financial/Dashboard/MetricCard'
import { FinancialHealthCard } from '../../components/financial/Dashboard/FinancialHealthCard'
import { EnhancedDashboard } from '../../components/financial/Dashboard/EnhancedDashboard'
import { useToasts } from '../../components/ui/toast'
import { ToastContainer } from '../../components/ui/toast'

export function FinancialManagementPage() {
  // ===== ESTADOS PRINCIPAIS =====
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showBalances, setShowBalances] = useState(true)
  
  // Sidebar persistente
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    }
    return false
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  // Toast notifications e quick feedback
  const { toasts, addToast, removeToast } = useToasts()

  // ===== DADOS FINANCEIROS =====
  const [financialData, setFinancialData] = useState<FinancialState>({
    accounts: [
      { id: '1', name: 'Conta Corrente', balance: 2500.50, type: 'checking' },
      { id: '2', name: 'Conta Poupança', balance: 15000.00, type: 'savings' },
      { id: '3', name: 'Investimentos', balance: 8500.75, type: 'investment' }
    ],
    incomes: [
      { id: '1', description: 'Salário Principal', amount: 2800, frequency: 'monthly' },
      { id: '2', description: 'Freelance', amount: 500, frequency: 'monthly' }
    ],
    expenses: [
      { id: '1', category: 'Habitação', description: 'Renda', amount: 650, frequency: 'monthly' },
      { id: '2', category: 'Alimentação', description: 'Supermercado', amount: 400, frequency: 'monthly' },
      { id: '3', category: 'Transporte', description: 'Combustível', amount: 200, frequency: 'monthly' },
      { id: '4', category: 'Entretenimento', description: 'Streaming', amount: 50, frequency: 'monthly' },
      { id: '5', category: 'Utilidades', description: 'Eletricidade', amount: 80, frequency: 'monthly' }
    ],
    debts: [
      { id: '1', description: 'Crédito Habitação', amount: 85000, interestRate: 3.5, monthlyPayment: 420 }
    ]
  })

  // ===== DADOS DO UTILIZADOR =====
  const user: User = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format',
    plan: 'Premium'
  }

  // ===== CÁLCULOS MEMOIZADOS (OTIMIZAÇÃO) =====
  const calculatedValues = useMemo(() => {
    const totalBalance = calculateTotalBalance(financialData.accounts)
    const monthlyIncome = calculateMonthlyIncome(financialData.incomes)
    const monthlyExpenses = calculateMonthlyExpenses(financialData.expenses)
    const totalDebt = calculateTotalDebt(financialData.debts)
    const monthlySavings = calculateMonthlySavings(financialData)
    const netWorth = calculateNetWorth(financialData)
    const financialHealth = calculateFinancialHealth(financialData)

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      totalDebt,
      monthlySavings,
      netWorth,
      financialHealth
    }
  }, [financialData])

  // ===== DADOS PARA COMPONENTES =====
  const financialSummary: FinancialSummary = useMemo(() => ({
    totalBalance: calculatedValues.totalBalance,
    monthlyIncome: calculatedValues.monthlyIncome,
    monthlyExpenses: calculatedValues.monthlyExpenses,
    netWorth: calculatedValues.netWorth
  }), [calculatedValues])

  const metricsData: MetricsData = useMemo(() => ({
    totalBalance: calculatedValues.totalBalance,
    monthlyIncome: calculatedValues.monthlyIncome,
    monthlyExpenses: calculatedValues.monthlyExpenses,
    netWorth: calculatedValues.netWorth,
    monthlySavings: calculatedValues.monthlySavings
  }), [calculatedValues])

  const quickActionsData: QuickActionsData = useMemo(() => ({
    accountsCount: financialData.accounts.length,
    incomesCount: financialData.incomes.length,
    expensesCount: financialData.expenses.length,
    debtsCount: financialData.debts.length
  }), [financialData])

  // ===== EFEITOS =====
  // Simulação de carregamento inicial otimizada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Quick feedback em vez de toast pesado
      QuickFeedback.show('Pronto!', 'success')
    }, 800) // Reduzido de 1500ms para 800ms

    return () => clearTimeout(timer)
  }, [])

  // Persistir estado da sidebar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', sidebarCollapsed.toString())
    }
  }, [sidebarCollapsed])

  // ===== HANDLERS =====
  const handleSectionChange = (section: string) => {
    if (section !== activeTab) {
      setActiveTab(section)
      // Loading instantâneo sem toast desnecessário
      // Usar breadcrumb visual em vez de notificação
    }
  }

  const handleLogout = () => {
    QuickFeedback.show('Sessão terminada', 'info')
    // Implementar lógica de logout
  }

  const handleQuickAction = () => {
    const actions: Record<string, string> = {
      'dashboard': 'income',
      'income': 'income',
      'expenses': 'expenses',
      'accounts': 'accounts',
      'debts': 'debts'
    }
    
    const targetSection = actions[activeTab] || 'income'
    handleSectionChange(targetSection)
  }

  // ===== UTILITÁRIOS =====
  const getSectionName = (section: string): string => {
    const names: Record<string, string> = {
      dashboard: 'Dashboard',
      income: 'Rendimentos',
      expenses: 'Despesas',
      accounts: 'Contas Bancárias',
      debts: 'Dívidas',
      goals: 'Metas Financeiras',
      projections: 'Projeções',
      reports: 'Relatórios',
      budget: 'Orçamentos',
      settings: 'Configurações',
      profile: 'Perfil'
    }
    return names[section] || section
  }

  // ===== RENDERIZAÇÃO DE SEÇÕES =====
  const renderActiveSection = () => {
    if (dashboardLoading) {
      return <SkeletonDashboard />
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="animate-fade-in">
            <EnhancedDashboard 
              showBalances={showBalances}
              financialData={financialData}
              calculatedValues={calculatedValues}
            />
          </div>
        )

      case 'income':
        return (
          <IncomeSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        )

      case 'expenses':
        return (
          <ExpenseSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        )

      case 'accounts':
        return (
          <AccountSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        )

      case 'debts':
        return (
          <DebtSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        )

      case 'reports':
        return (
          <ReportsSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        )

      case 'goals':
        return (
          <GoalsSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        )

      default:
        return (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚧</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {getSectionName(activeTab)}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Esta funcionalidade está em desenvolvimento. Em breve estará disponível com todas as ferramentas necessárias.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => handleSectionChange('dashboard')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Voltar ao Dashboard
              </button>
              <button
                onClick={() => QuickFeedback.show('Solicitação registada!', 'info')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2 inline" />
                Solicitar Prioridade
              </button>
            </div>
          </div>
        )
    }
  }

  // ===== LOADING INICIAL =====
  if (isLoading) {
    return <LoadingSpinner message="Carregando aplicação financeira..." size="lg" />
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar melhorada e compacta */}
      <EnhancedSidebar
        user={user}
        financialSummary={financialSummary}
        activeSection={activeTab}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile overlay para sidebar */}
      {!sidebarCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Header melhorado e mais clean */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 px-6 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Botão mobile menu */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {getSectionName(activeTab)}
                </h2>
                {/* Removida a descrição para interface mais clean */}
              </div>
            </div>
            
            {/* Ações contextuais */}
            <div className="flex items-center space-x-3">
              <NotificationBell count={3} />
              <QuickActionButton 
                activeSection={activeTab} 
                onAction={handleQuickAction}
              />
            </div>
          </div>
        </header>

        {/* Área de conteúdo */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActiveSection()}
        </main>
      </div>

      {/* Sistema de notificações - apenas para importantes */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Quick feedback overlay */}
      <QuickFeedback />
    </div>
  )
}

export default {
  Page: FinancialManagementPage,
}