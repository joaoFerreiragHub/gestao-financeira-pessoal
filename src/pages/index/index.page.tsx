import { useState, useEffect, useMemo } from 'react'
import { Bell, Plus } from 'lucide-react'

// Componentes melhorados
import { EnhancedSidebar } from '../../components/layout/EnhancedSidebar'





// Componentes existentes
import { IncomeSection } from '../../components/financial/income/IncomeSection'
import { ExpenseSection } from '../../components/financial/expenses/ExpenseSection'

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
import { QuickActions } from '../../components/layout/dashboard/QuickActions'
import { LoadingSpinner, SkeletonDashboard } from '../../components/financial/Common/LoadingSpinner'
import { MetricGrid } from '../../components/layout/dashboard/metricCard'
import { FinancialHealthCard } from '../../components/financial/Dashboard/FinancialHealthCard'
import { useToasts } from '../../components/ui/toast'

export function FinancialManagementPage() {
  // ===== ESTADOS PRINCIPAIS =====
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showBalances, setShowBalances] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  // Toast notifications
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
  // Simulação de carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      addToast({
        type: 'success',
        title: 'Bem-vindo!',
        message: 'Dados carregados com sucesso.'
      })
    }, 1500) // Reduzido de 2000ms para 1500ms

    return () => clearTimeout(timer)
  }, [addToast])

  // ===== HANDLERS =====
  const handleSectionChange = (section: string) => {
    if (section !== activeTab) {
      setDashboardLoading(true)
      setActiveTab(section)
      
      // Simular carregamento de seção (otimizado)
      setTimeout(() => {
        setDashboardLoading(false)
        addToast({
          type: 'info',
          title: 'Seção carregada',
          message: `Navegou para ${getSectionName(section)}`
        })
      }, 300) // Reduzido de 500ms para 300ms
    }
  }

  const handleLogout = () => {
    addToast({
      type: 'info',
      title: 'Logout',
      message: 'Sessão terminada com sucesso'
    })
    // Implementar lógica de logout
  }

  const handleNewRecord = () => {
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
      projections: 'Projeções',
      budget: 'Orçamentos',
      reports: 'Relatórios',
      goals: 'Metas',
      settings: 'Configurações',
      profile: 'Perfil'
    }
    return names[section] || section
  }

  const getPageDescription = (tab: string): string => {
    const descriptions: Record<string, string> = {
      dashboard: 'Visão geral completa das suas finanças pessoais',
      income: 'Gerencie e acompanhe todas as suas fontes de rendimento',
      expenses: 'Controle seus gastos por categoria e analise padrões',
      accounts: 'Administre suas contas bancárias e saldos',
      debts: 'Monitore e organize seus empréstimos e financiamentos',
      projections: 'Visualize projeções futuras baseadas nos dados atuais',
      budget: 'Defina e acompanhe orçamentos por categoria',
      reports: 'Relatórios detalhados e análises avançadas',
      goals: 'Defina e acompanhe suas metas financeiras',
      settings: 'Configurações da aplicação e preferências',
      profile: 'Informações do perfil e dados pessoais'
    }
    return descriptions[tab] || 'Gerencie suas finanças de forma inteligente'
  }

  // ===== RENDERIZAÇÃO DE SEÇÕES =====
  const renderActiveSection = () => {
    if (dashboardLoading) {
      return <SkeletonDashboard />
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Métricas principais */}
            <MetricGrid 
              financialData={metricsData}
              showBalances={showBalances}
              onToggleBalances={() => setShowBalances(!showBalances)}
            />

            {/* Saúde financeira - PROPS CORRIGIDAS */}
            <FinancialHealthCard 
              healthData={calculatedValues.financialHealth}
              showValues={showBalances}
            />

            {/* Grid de conteúdo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ações rápidas */}
              <QuickActions 
                onNavigate={handleSectionChange}
                financialData={quickActionsData}
              />

              {/* Visão geral */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Geral</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Contas bancárias:</span>
                    <span className="font-medium text-gray-900">{financialData.accounts.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Fontes de renda:</span>
                    <span className="font-medium text-gray-900">{financialData.incomes.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Categorias de despesas:</span>
                    <span className="font-medium text-gray-900">{financialData.expenses.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Dívidas ativas:</span>
                    <span className="font-medium text-gray-900">{financialData.debts.length}</span>
                  </div>
                </div>

                {/* Última atualização */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Última atualização: {new Date().toLocaleString('pt-PT')}
                  </p>
                </div>
              </div>
            </div>

            {/* Dica do dia */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">💡</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Dica Financeira do Dia</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {calculatedValues.monthlySavings > 0 
                      ? `Parabéns! Está a poupar €${calculatedValues.monthlySavings.toFixed(2)} por mês. Considere automatizar uma transferência para uma conta poupança logo após receber o salário.`
                      : 'Está a gastar mais do que ganha. Revise suas despesas e identifique onde pode cortar gastos desnecessários.'
                    }
                  </p>
                </div>
              </div>
            </div>
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
                onClick={() => addToast({
                  type: 'info',
                  title: 'Funcionalidade solicitada',
                  message: 'Obrigado pelo interesse! Será notificado quando estiver disponível.'
                })}
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
      {/* Sidebar melhorada */}
      <EnhancedSidebar
        user={user}
        financialSummary={financialSummary}
        activeSection={activeTab}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Header melhorado */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {getSectionName(activeTab)}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {getPageDescription(activeTab)}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notificações */}
              <button 
                onClick={() => addToast({
                  type: 'info',
                  title: 'Notificações',
                  message: 'Sem notificações pendentes'
                })}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              
              {/* Novo registro */}
              <button 
                onClick={handleNewRecord}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Novo Registro</span>
              </button>
            </div>
          </div>
        </header>

        {/* Área de conteúdo */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActiveSection()}
        </main>
      </div>

      {/* Sistema de notificações */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default {
  Page: FinancialManagementPage,
}