import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff, 
  Plus, 
  Bell,
  Search,
  CreditCard,
  PiggyBank,
  Target,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Home,
  Receipt,
  LineChart,
  ChevronRight,
  Sparkles,
  Building2,
  FileText
} from 'lucide-react';

// Import the new sections we created
import { AccountSection } from '../../components/financial/accounts/AccountSection';
import { ReportsSection } from '../../components/financial/reports/ReportsSection';
import { GoalsSection } from '../../components/financial/goals/GoalsSection';
import { IncomeSection } from '../../components/financial/income/IncomeSection';
import { ExpenseSection } from '../../components/financial/expenses/ExpenseSection';
import { DebtSection } from '../../components/financial/debts/DebtSection';

const ModernFinanceDashboard = () => {
  const [showBalances, setShowBalances] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Dados mock melhorados
  const financialData = {
    patrimonio: -58998.75,
    receitas: 3300.00,
    despesas: 1380.00,
    poupanca: 1500.00,
    taxaPoupanca: 45.5,
    ratioGastos: 41.8,
    variacao: {
      patrimonio: 4.1,
      receitas: 3.2,
      despesas: -2.1,
      poupanca: 8.7
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(value));
  };

  const getVariationDisplay = (value: number) => {
    const isPositive = value > 0;
    return {
      color: isPositive ? 'text-emerald-500' : 'text-red-500',
      icon: isPositive ? TrendingUp : TrendingDown,
      prefix: isPositive ? '+' : ''
    };
  };

  // Sidebar Navigation
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'accounts', label: 'Contas Bancárias', icon: Building2, badge: '4' },
    { id: 'income', label: 'Rendimentos', icon: TrendingUp, badge: '2' },
    { id: 'expenses', label: 'Despesas', icon: Receipt, badge: '5' },
    { id: 'debts', label: 'Dívidas', icon: CreditCard, badge: '1' },
    { id: 'goals', label: 'Metas Financeiras', icon: Target, badge: '5' },
    { id: 'projections', label: 'Projeções', icon: LineChart, badge: null },
    { id: 'reports', label: 'Relatórios', icon: FileText, badge: null }
  ];

  const categoryData = [
    { name: 'Habitação', value: 750, percentage: 35.7, color: 'bg-blue-500' },
    { name: 'Alimentação', value: 450, percentage: 21.4, color: 'bg-emerald-500' },
    { name: 'Transporte', value: 320, percentage: 15.2, color: 'bg-amber-500' },
    { name: 'Entretenimento', value: 280, percentage: 13.3, color: 'bg-purple-500' },
    { name: 'Outros', value: 300, percentage: 14.3, color: 'bg-slate-500' }
  ];

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-400" />
          </div>
          <p className="text-white/80 mt-4 font-medium">FinanceHub</p>
          <p className="text-white/60 text-sm mt-1">Carregando sua gestão financeira...</p>
        </div>
      </div>
    );
  }

        return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar Moderna */}
      <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-white/20 shadow-xl">
        <div className="p-6">
          {/* Header da Sidebar */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                FinanceHub
              </h1>
              <p className="text-xs text-slate-500">Gestão Inteligente</p>
                    </div>
                    </div>

          {/* User Profile */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
                    </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">João Silva</p>
                <p className="text-sm text-slate-600">Premium User</p>
                    </div>
                  </div>
                </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
                </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Dashboard Financeiro</h2>
                <p className="text-slate-600 text-sm">Acompanhe suas finanças em tempo real</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  className="pl-10 pr-4 py-2 bg-slate-100/70 border border-slate-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                />
                </div>

              {/* Toggle Balances */}
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                title={showBalances ? 'Ocultar valores' : 'Mostrar valores'}
              >
                {showBalances ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Quick Action */}
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Nova Transação</span>
              </button>
                </div>
              </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderActiveSection()}
            </div>
      </main>
          </div>
  );

  // Section rendering function
  function renderActiveSection() {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'accounts':
        return (
          <AccountSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        );
      case 'income':
        return (
          <IncomeSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        );
      case 'expenses':
        return (
          <ExpenseSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        );
      case 'debts':
        return (
          <DebtSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        );
      case 'goals':
        return (
          <GoalsSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        );
      case 'reports':
        return (
          <ReportsSection 
            showBalances={showBalances} 
            onToggleBalances={() => setShowBalances(!showBalances)}
          />
        );
      case 'projections':
        return (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LineChart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Projeções Financeiras</h3>
            <p className="text-gray-600 mb-6">Esta funcionalidade estará disponível em breve.</p>
            </div>
        );
      default:
        return renderDashboard();
    }
  }

  function renderDashboard() {
    return (
      <div>
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Patrimônio Líquido */}
            <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Ativos - Passivos</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {(() => {
                      const variation = getVariationDisplay(financialData.variacao.patrimonio);
                      const Icon = variation.icon;
  return (
                        <div className={`flex items-center space-x-1 ${variation.color}`}>
                          <Icon className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            {variation.prefix}{financialData.variacao.patrimonio}%
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Patrimônio Líquido</p>
                <p className="text-2xl font-bold text-slate-800">
                  {showBalances ? formatCurrency(financialData.patrimonio) : '••••••'}
                </p>
              </div>
            </div>

            {/* Receitas */}
            <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Todas as fontes</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">+3.2%</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Receitas Mensais</p>
                <p className="text-2xl font-bold text-slate-800">
                  {showBalances ? formatCurrency(financialData.receitas) : '••••••'}
                </p>
              </div>
            </div>

            {/* Despesas */}
            <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <ArrowDownRight className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Gastos totais</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">-2.1%</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Despesas Mensais</p>
                <p className="text-2xl font-bold text-slate-800">
                  {showBalances ? formatCurrency(financialData.despesas) : '••••••'}
                </p>
              </div>
            </div>

            {/* Poupança */}
            <div className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Sobra após despesas</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">+8.7%</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Poupança Mensal</p>
                <p className="text-2xl font-bold text-slate-800">
                  {showBalances ? formatCurrency(financialData.poupanca) : '••••••'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats & Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Progress Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Taxa de Poupança */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Taxa de Poupança</h3>
                  <span className="text-2xl font-bold text-emerald-600">{financialData.taxaPoupanca}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${financialData.taxaPoupanca}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-600">Excelente! Você está poupando acima da recomendação.</p>
              </div>

              {/* Ratio de Despesas */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Ratio de Despesas</h3>
                  <span className="text-2xl font-bold text-blue-600">{financialData.ratioGastos}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${financialData.ratioGastos}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-600">Controlado. Suas despesas estão dentro do esperado.</p>
              </div>
            </div>
            
            {/* Categories Breakdown */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Categorias de Despesa</h3>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span className="text-sm font-medium text-slate-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">
                        {showBalances ? formatCurrency(category.value) : '•••'}
                      </p>
                      <p className="text-xs text-slate-500">{category.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Transactions */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Transações Recentes</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                  <span>Ver todas</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { type: 'expense', category: 'Alimentação', amount: -45.60, date: 'Hoje', time: '14:30' },
                  { type: 'income', category: 'Salário', amount: 2800.00, date: 'Ontem', time: '09:00' },
                  { type: 'expense', category: 'Transporte', amount: -12.80, date: '2 dias', time: '08:15' },
                  { type: 'expense', category: 'Entretenimento', amount: -35.00, date: '3 dias', time: '19:45' }
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? 
                          <ArrowUpRight className="h-5 w-5" /> : 
                          <ArrowDownRight className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{transaction.category}</p>
                        <p className="text-sm text-slate-500">{transaction.date} às {transaction.time}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
      </div>

            {/* Quick Actions & Goals */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:shadow-lg transition-all duration-200 group">
                    <Receipt className="h-6 w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-blue-800">Nova Despesa</p>
                  </button>
                  <button className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl hover:shadow-lg transition-all duration-200 group">
                    <TrendingUp className="h-6 w-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-emerald-800">Registrar Receita</p>
                  </button>
                  <button className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:shadow-lg transition-all duration-200 group">
                    <Target className="h-6 w-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-purple-800">Nova Meta</p>
                  </button>
                  <button className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl hover:shadow-lg transition-all duration-200 group">
                    <BarChart3 className="h-6 w-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-amber-800">Gerar Relatório</p>
                  </button>
                </div>
              </div>

              {/* Meta de Poupança */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Meta de Poupança</h3>
                </div>
                <p className="text-blue-100 text-sm mb-3">
                  Você está 15% abaixo da sua meta mensal de poupança
                </p>
                <div className="bg-white/20 rounded-full h-2 mb-3">
                  <div className="bg-white h-2 rounded-full w-3/4"></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-100">Progresso atual</span>
                  <span className="font-semibold">75%</span>
                </div>
              </div>
            </div>
          </div>
    </div>
      );
}
};

export default {
  Page: ModernFinanceDashboard,
}