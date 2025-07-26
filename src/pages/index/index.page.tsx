
import type { 
  Account, 
  Income, 
  Expense, 
  Debt, 
  FinancialState,
} from '../../types/pageContext'

// Hooks e Utilities
import { useLocalStorage } from '../../hooks/useLocalStorage'
import {
  calculateTotalBalance,
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
  calculateTotalDebt,
  calculateMonthlySavings,
  calculateNetWorth,
  calculateExpensesByCategory,
  generateProjections,
  calculateFinancialHealth,
  calculateDebtPayoffTime
} from '../../utils/financial'

// Common Components
import { LoadingSpinner } from '../../components/financial/Common/LoadingSpinner'
import { TabNavigation } from '../../components/financial/Common/TabNavigation'
import { DataManagement } from '../../components/financial/Common/DataManagement'

// Dashboard Components
import { FinancialHealthCard } from '../../components/financial/Dashboard/FinancialHealthCard'
import { SummaryCards } from '../../components/financial/Dashboard/SummaryCards'
import { Charts } from '../../components/financial/Dashboard/Charts'

// Form Components
import { AccountForm } from '../../components/financial/Forms/AccountForm'
import { IncomeForm } from '../../components/financial/Forms/IncomeForm'
import { ExpenseForm } from '../../components/financial/Forms/ExpenseForm'
import { DebtForm } from '../../components/financial/Forms/DebtForm'

// List Components
import { AccountsList } from '../../components/financial/Lists/AccountsList'
import { IncomesList } from '../../components/financial/Lists/IncomesList'
import { ExpensesList } from '../../components/financial/Lists/ExpensesList'
import { DebtsList } from '../../components/financial/Lists/DebtsList'

// Projection Components
import { ProjectionsChart } from '../../components/financial/Projections/ProjectionsChart'
import { ProjectionCards } from '../../components/financial/Projections/ProjectionCards'
import { ProjectionAnalysis } from '../../components/financial/Projections/ProjectionAnalysis'
import { useEffect, useState } from 'react'

export function FinancialManagementPage() {
  // Estado principal
  const [activeTab, setActiveTab] = useState('dashboard')
  const [financialData, setFinancialData, isClientReady] = useLocalStorage<FinancialState>('financialData', {
    accounts: [],
    incomes: [],
    expenses: [],
    debts: []
  })

  // Estado para controlar renderização de gráficos (SSR-safe)
  const [chartsReady, setChartsReady] = useState(false)

  // Aguardar hidratação para renderizar gráficos
  useEffect(() => {
    if (isClientReady) {
      setChartsReady(true)
    }
  }, [isClientReady])

  // Cálculos principais
  const totalBalance = calculateTotalBalance(financialData.accounts)
  const monthlyIncome = calculateMonthlyIncome(financialData.incomes)
  const monthlyExpenses = calculateMonthlyExpenses(financialData.expenses)
  const totalDebt = calculateTotalDebt(financialData.debts)
  const monthlySavings = calculateMonthlySavings(financialData)
  const netWorth = calculateNetWorth(financialData)
  const projections = generateProjections(financialData)
  const financialHealth = calculateFinancialHealth(financialData)
  const debtPayoffTime = calculateDebtPayoffTime(financialData.debts)

  // Dados para gráficos
  const expensesByCategory = calculateExpensesByCategory(financialData.expenses)
  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }))

  const barChartData = [
    { name: 'Rendimentos', amount: monthlyIncome, fill: '#22c55e' },
    { name: 'Despesas', amount: monthlyExpenses, fill: '#ef4444' },
    { name: 'Economia', amount: monthlySavings, fill: monthlySavings >= 0 ? '#3b82f6' : '#ef4444' }
  ]

  // Funções CRUD
  const addAccount = (account: Omit<Account, 'id'>) => {
    setFinancialData({
      ...financialData,
      accounts: [...financialData.accounts, { ...account, id: Date.now().toString() }]
    })
  }

  const removeAccount = (id: string) => {
    setFinancialData({
      ...financialData,
      accounts: financialData.accounts.filter(account => account.id !== id)
    })
  }

  const addIncome = (income: Omit<Income, 'id'>) => {
    setFinancialData({
      ...financialData,
      incomes: [...financialData.incomes, { ...income, id: Date.now().toString() }]
    })
  }

  const removeIncome = (id: string) => {
    setFinancialData({
      ...financialData,
      incomes: financialData.incomes.filter(income => income.id !== id)
    })
  }

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setFinancialData({
      ...financialData,
      expenses: [...financialData.expenses, { ...expense, id: Date.now().toString() }]
    })
  }

  const removeExpense = (id: string) => {
    setFinancialData({
      ...financialData,
      expenses: financialData.expenses.filter(expense => expense.id !== id)
    })
  }

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    setFinancialData({
      ...financialData,
      debts: [...financialData.debts, { ...debt, id: Date.now().toString() }]
    })
  }

  const removeDebt = (id: string) => {
    setFinancialData({
      ...financialData,
      debts: financialData.debts.filter(debt => debt.id !== id)
    })
  }

  const handleDataImport = (data: FinancialState) => {
    setFinancialData(data)
  }

  const handleDataClear = () => {
    setFinancialData({
      accounts: [],
      incomes: [],
      expenses: [],
      debts: []
    })
  }

  // Se ainda não estiver hidratado, mostrar loading
  if (!isClientReady) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-8">
      {/* Header da Aplicação */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestão Financeira Pessoal</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Controle seus rendimentos, despesas, contas bancárias e acompanhe projeções futuras 
          da sua saúde financeira com análises detalhadas.
        </p>
      </div>

      {/* Indicador de Saúde Financeira */}
      <FinancialHealthCard healthData={financialHealth} />

      {/* Navegação */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conteúdo das Tabs */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Cards de Resumo */}
          <SummaryCards
            netWorth={netWorth}
            totalBalance={totalBalance}
            monthlySavings={monthlySavings}
            totalDebt={totalDebt}
            debtPayoffTime={debtPayoffTime}
          />

          {/* Gráficos */}
          <Charts
            pieChartData={pieChartData}
            barChartData={barChartData}
            isReady={chartsReady}
          />
        </div>
      )}

      {/* Tab de Contas */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <AccountForm onAddAccount={addAccount} />
          <AccountsList accounts={financialData.accounts} onRemoveAccount={removeAccount} />
        </div>
      )}

      {/* Tab de Rendimentos */}
      {activeTab === 'income' && (
        <div className="space-y-6">
          <IncomeForm onAddIncome={addIncome} />
          <IncomesList incomes={financialData.incomes} onRemoveIncome={removeIncome} />
        </div>
      )}

      {/* Tab de Despesas */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <ExpenseForm onAddExpense={addExpense} />
          <ExpensesList expenses={financialData.expenses} onRemoveExpense={removeExpense} />
        </div>
      )}

      {/* Tab de Dívidas */}
      {activeTab === 'debts' && (
        <div className="space-y-6">
          <DebtForm onAddDebt={addDebt} />
          <DebtsList debts={financialData.debts} onRemoveDebt={removeDebt} />
        </div>
      )}

      {/* Tab de Projeções */}
      {activeTab === 'projections' && (
        <div className="space-y-8">
          <ProjectionsChart projections={projections} isReady={chartsReady} />
          <ProjectionCards projections={projections} />
          <ProjectionAnalysis projections={projections} financialData={financialData} />
        </div>
      )}

      {/* Gestão de Dados */}
      <DataManagement
        financialData={financialData}
        onDataImport={handleDataImport}
        onDataClear={handleDataClear}
      />
    </div>
  )
}

export default {
  Page: FinancialManagementPage,
} 