import {  useState } from 'react'

import { Download, Upload, Trash2, BarChart3, Wallet, TrendingUp, TrendingDown, AlertTriangle, PiggyBank, Eye, EyeOff } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Tabs, TabsContent } from '../../components/ui/tabs'

// Assumindo que você tem estes tipos definidos
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

export function ImprovedFinancialManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showBalances, setShowBalances] = useState(true)
  const [financialData, setFinancialData] = useState<FinancialState>({
    accounts: [],
    incomes: [],
    expenses: [],
    debts: []
  })

  // Cálculos mock (você usaria suas funções de cálculo reais)
  const totalBalance = financialData.accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlyIncome = financialData.incomes.reduce((sum, income) => 
    sum + (income.frequency === 'monthly' ? income.amount : income.amount / 12), 0)
  const monthlyExpenses = financialData.expenses.reduce((sum, expense) => 
    sum + (expense.frequency === 'monthly' ? expense.amount : expense.amount / 12), 0)
  const totalDebt = financialData.debts.reduce((sum, debt) => sum + debt.amount, 0)
  const monthlySavings = monthlyIncome - monthlyExpenses
  const netWorth = totalBalance - totalDebt

  // Mock da saúde financeira
  const financialHealth: FinancialHealthData = {
    score: 72,
    status: 'Boa',
    savingsRate: monthlySavings / monthlyIncome * 100 || 0,
    debtToAssetRatio: totalDebt / Math.max(totalBalance, 1) * 100,
    emergencyFundMonths: totalBalance / Math.max(monthlyExpenses, 1)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header Melhorado */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Wallet className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">FinHub</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Controle suas finanças pessoais de forma simples e intuitiva
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ✨ Interface renovada
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              📊 Análises em tempo real
            </Badge>
          </div>
        </div>

        {/* Cards de Resumo Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Patrimônio Líquido
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
                className="h-8 w-8 p-0"
              >
                {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {showBalances ? formatCurrency(netWorth) : '€****'}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Total de ativos menos dívidas
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Receitas Mensais
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(monthlyIncome)}
              </div>
              <p className="text-xs text-green-600 mt-1">
                {financialData.incomes.length} fonte(s) de renda
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                Gastos Mensais
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {formatCurrency(monthlyExpenses)}
              </div>
              <p className="text-xs text-red-600 mt-1">
                {financialData.expenses.length} despesa(s) registrada(s)
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Economia Mensal
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlySavings >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
                {formatCurrency(monthlySavings)}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                {monthlySavings >= 0 ? 'Poupando' : 'Gastando mais que ganha'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Indicador de Saúde Financeira */}
        {/* Aqui você incluiria o FinancialHealthCard melhorado */}
        
        {/* Navegação com Tabs do shadcn */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'accounts', label: 'Contas', icon: Wallet },
                { id: 'income', label: 'Rendimentos', icon: TrendingUp },
                { id: 'expenses', label: 'Despesas', icon: TrendingDown },
                { id: 'debts', label: 'Dívidas', icon: AlertTriangle },
                { id: 'projections', label: 'Projeções', icon: PiggyBank }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visão Geral</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => setActiveTab('income')} className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Adicionar Rendimento
                  </Button>
                  <Button onClick={() => setActiveTab('expenses')} className="w-full justify-start" variant="outline">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Registar Despesa
                  </Button>
                  <Button onClick={() => setActiveTab('accounts')} className="w-full justify-start" variant="outline">
                    <Wallet className="h-4 w-4 mr-2" />
                    Nova Conta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Seção de Contas - Aqui você incluiria o AccountForm e AccountsList melhorados</p>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Seção de Rendimentos - Aqui você incluiria o IncomeForm e IncomesList melhorados</p>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Seção de Despesas - Aqui você incluiria o ExpenseForm e ExpensesList melhorados</p>
            </div>
          </TabsContent>

          <TabsContent value="debts" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Seção de Dívidas - Aqui você incluiria o DebtForm e DebtsList melhorados</p>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Seção de Projeções - Aqui você incluiria os componentes de projeção melhorados</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Gestão de Dados Melhorada */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Gestão de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar Dados
              </Button>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Importar Dados
              </Button>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Limpar Dados
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Exporte regularmente seus dados como backup. Os dados são salvos localmente no seu navegador.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>© 2025 FinHub - Sistema de gestão financeira pessoal</p>
        </div>
      </div>
    </div>
  )
}