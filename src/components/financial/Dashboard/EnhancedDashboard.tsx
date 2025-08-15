import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  PieChart,
  BarChart3
} from 'lucide-react';

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';

// Types
interface EnhancedDashboardProps {
  showBalances: boolean;
  financialData: any;
  calculatedValues: any;
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  showBalances,
  financialData,
  calculatedValues
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Sample data for enhanced metrics - in real app would come from props
  const monthlyGrowth = {
    income: 3.2,
    expenses: -2.1,
    savings: 8.7,
    netWorth: 4.1
  };

  const savingsRate = calculatedValues.monthlyIncome > 0 
    ? (calculatedValues.monthlySavings / calculatedValues.monthlyIncome) * 100 
    : 0;

  const expenseRatio = calculatedValues.monthlyIncome > 0
    ? (calculatedValues.monthlyExpenses / calculatedValues.monthlyIncome) * 100
    : 0;

  // Enhanced metrics data
  const enhancedMetrics = [
    {
      title: 'Patrimônio Líquido',
      value: calculatedValues.netWorth,
      growth: monthlyGrowth.netWorth,
      icon: TrendingUp,
      color: 'blue',
      description: 'Ativos - Passivos'
    },
    {
      title: 'Receitas Mensais',
      value: calculatedValues.monthlyIncome,
      growth: monthlyGrowth.income,
      icon: DollarSign,
      color: 'green',
      description: 'Todas as fontes de renda'
    },
    {
      title: 'Despesas Mensais',
      value: calculatedValues.monthlyExpenses,
      growth: monthlyGrowth.expenses,
      icon: TrendingDown,
      color: 'red',
      description: 'Gastos totais do mês'
    },
    {
      title: 'Poupança Mensal',
      value: calculatedValues.monthlySavings,
      growth: monthlyGrowth.savings,
      icon: Target,
      color: 'purple',
      description: 'Sobra após despesas'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
      green: 'from-green-50 to-green-100 border-green-200 text-green-800',
      red: 'from-red-50 to-red-100 border-red-200 text-red-800',
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const alerts = [
    {
      type: 'warning' as const,
      title: 'Meta de Poupança',
      message: 'Você está 15% abaixo da sua meta mensal de poupança',
      action: 'Revisar gastos'
    },
    {
      type: 'success' as const,
      title: 'Dívida em Queda',
      message: 'Pagamento do cartão reduziu sua dívida em 8% este mês',
      action: 'Manter ritmo'
    },
    {
      type: 'info' as const,
      title: 'Oportunidade',
      message: 'Sua conta poupança pode render mais com investimentos',
      action: 'Explorar opções'
    }
  ];

  const quickStats = [
    {
      label: 'Contas Bancárias',
      value: financialData.accounts.length,
      icon: '🏦'
    },
    {
      label: 'Fontes de Renda',
      value: financialData.incomes.length,
      icon: '💰'
    },
    {
      label: 'Categorias de Despesa',
      value: new Set(financialData.expenses.map((e: any) => e.category)).size,
      icon: '📊'
    },
    {
      label: 'Dívidas Ativas',
      value: financialData.debts.length,
      icon: '💳'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enhancedMetrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.growth >= 0;
          const colorClasses = getColorClasses(metric.color);
          
          return (
            <Card key={metric.title} className={`bg-gradient-to-br ${colorClasses} hover:shadow-lg transition-all duration-200`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{metric.title}</CardTitle>
                  <Icon className="h-6 w-6" />
                </div>
                <CardDescription className="text-sm">{metric.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-3">
                  {showBalances ? formatCurrency(metric.value) : '€ •••••'}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {isPositive ? 
                      <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    }
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(metric.growth)}
                    </span>
                  </div>
                  <span className="text-xs opacity-75">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Financial Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Saúde Financeira</span>
            </CardTitle>
            <CardDescription>Indicadores de performance financeira</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Taxa de Poupança</span>
                  <span className="text-sm font-bold text-gray-900">{savingsRate.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(savingsRate, 100)} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">
                  {savingsRate >= 20 ? 'Excelente!' : savingsRate >= 10 ? 'Bom!' : 'Pode melhorar'}
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Ratio de Despesas</span>
                  <span className="text-sm font-bold text-gray-900">{expenseRatio.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(expenseRatio, 100)} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">
                  {expenseRatio <= 50 ? 'Controlado' : expenseRatio <= 80 ? 'Atenção' : 'Alto risco'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {quickStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Alertas Inteligentes</span>
            </CardTitle>
            <CardDescription>Insights e recomendações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => {
              const getAlertIcon = () => {
                switch (alert.type) {
                  case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
                  case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
                  case 'info': return <TrendingUp className="h-4 w-4 text-blue-500" />;
                  default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
                }
              };

              const getAlertBadge = () => {
                switch (alert.type) {
                  case 'warning': return 'destructive';
                  case 'success': return 'default';
                  case 'info': return 'secondary';
                  default: return 'secondary';
                }
              };

              return (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon()}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <Badge variant={getAlertBadge() as any} className="text-xs">
                          {alert.type === 'warning' ? 'Atenção' : 
                           alert.type === 'success' ? 'Sucesso' : 'Info'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{alert.message}</p>
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        {alert.action} →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Resumo do Mês</span>
            </CardTitle>
            <CardDescription>Janeiro 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Receitas</p>
                    <p className="text-sm text-green-700">Todas as fontes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-900">
                    {showBalances ? formatCurrency(calculatedValues.monthlyIncome) : '€ •••••'}
                  </p>
                  <p className="text-sm text-green-600">{formatPercentage(monthlyGrowth.income)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Despesas</p>
                    <p className="text-sm text-red-700">Gastos totais</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-900">
                    {showBalances ? formatCurrency(calculatedValues.monthlyExpenses) : '€ •••••'}
                  </p>
                  <p className="text-sm text-red-600">{formatPercentage(monthlyGrowth.expenses)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Saldo</p>
                    <p className="text-sm text-blue-700">Receitas - Despesas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-900">
                    {showBalances ? formatCurrency(calculatedValues.monthlySavings) : '€ •••••'}
                  </p>
                  <p className="text-sm text-blue-600">{formatPercentage(monthlyGrowth.savings)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Distribuição de Gastos</span>
            </CardTitle>
            <CardDescription>Top categorias este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: 'Habitação', amount: 750, percentage: 35.7, color: 'bg-blue-500' },
                { category: 'Alimentação', amount: 450, percentage: 21.4, color: 'bg-green-500' },
                { category: 'Transporte', amount: 320, percentage: 15.2, color: 'bg-yellow-500' },
                { category: 'Entretenimento', amount: 280, percentage: 13.3, color: 'bg-purple-500' },
                { category: 'Outros', amount: 300, percentage: 14.3, color: 'bg-gray-500' }
              ].map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {showBalances ? formatCurrency(item.amount) : '€ •••'}
                    </p>
                    <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
