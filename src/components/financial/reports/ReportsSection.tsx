import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  FileText,
  Target,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

// Types
interface ReportData {
  period: string;
  income: number;
  expenses: number;
  savings: number;
  netWorth: number;
}

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  trend: number;
  color: string;
}

interface ReportsSectionProps {
  showBalances: boolean;
  onToggleBalances?: () => void;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  showBalances,
  onToggleBalances
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [activeReport, setActiveReport] = useState<'overview' | 'income' | 'expenses' | 'trends'>('overview');

  // Sample data - in real app this would come from hooks/context
  const reportData: ReportData[] = [
    { period: 'Jan 2025', income: 3300, expenses: 2100, savings: 1200, netWorth: 25500 },
    { period: 'Dez 2024', income: 3200, expenses: 2300, savings: 900, netWorth: 24300 },
    { period: 'Nov 2024', income: 3100, expenses: 1950, savings: 1150, netWorth: 23400 },
    { period: 'Out 2024', income: 3000, expenses: 2000, savings: 1000, netWorth: 22250 },
    { period: 'Set 2024', income: 3100, expenses: 2200, savings: 900, netWorth: 21250 },
    { period: 'Ago 2024', income: 3200, expenses: 2100, savings: 1100, netWorth: 20350 }
  ];

  const expenseCategories: CategoryData[] = [
    { name: 'Habitação', amount: 750, percentage: 35.7, trend: -2.3, color: 'bg-blue-500' },
    { name: 'Alimentação', amount: 450, percentage: 21.4, trend: 1.2, color: 'bg-green-500' },
    { name: 'Transporte', amount: 320, percentage: 15.2, trend: -5.1, color: 'bg-yellow-500' },
    { name: 'Entretenimento', amount: 280, percentage: 13.3, trend: 8.7, color: 'bg-purple-500' },
    { name: 'Saúde', amount: 180, percentage: 8.6, trend: 3.4, color: 'bg-red-500' },
    { name: 'Outros', amount: 120, percentage: 5.7, trend: -1.2, color: 'bg-gray-500' }
  ];

  const incomeCategories: CategoryData[] = [
    { name: 'Salário Principal', amount: 2800, percentage: 84.8, trend: 2.1, color: 'bg-green-600' },
    { name: 'Freelance', amount: 400, percentage: 12.1, trend: 15.3, color: 'bg-blue-600' },
    { name: 'Investimentos', amount: 100, percentage: 3.0, trend: 25.7, color: 'bg-purple-600' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Calculations
  const currentMonthData = reportData[0];
  const previousMonthData = reportData[1];
  
  const incomeGrowth = ((currentMonthData.income - previousMonthData.income) / previousMonthData.income) * 100;
  const expenseGrowth = ((currentMonthData.expenses - previousMonthData.expenses) / previousMonthData.expenses) * 100;
  const savingsGrowth = ((currentMonthData.savings - previousMonthData.savings) / previousMonthData.savings) * 100;

  const savingsRate = (currentMonthData.savings / currentMonthData.income) * 100;
  const expenseRatio = (currentMonthData.expenses / currentMonthData.income) * 100;

  const generateReport = (type: string) => {
    const reportContent = {
      overview: `Relatório Financeiro - ${currentMonthData.period}\n\nResumo Executivo:\n- Receitas: ${formatCurrency(currentMonthData.income)}\n- Despesas: ${formatCurrency(currentMonthData.expenses)}\n- Poupança: ${formatCurrency(currentMonthData.savings)}\n- Taxa de Poupança: ${savingsRate.toFixed(1)}%`,
      detailed: `Relatório Detalhado - ${currentMonthData.period}\n\nAnálise por Categorias:\n\nReceitas:\n${incomeCategories.map(cat => `- ${cat.name}: ${formatCurrency(cat.amount)} (${cat.percentage.toFixed(1)}%)`).join('\n')}\n\nDespesas:\n${expenseCategories.map(cat => `- ${cat.name}: ${formatCurrency(cat.amount)} (${cat.percentage.toFixed(1)}%)`).join('\n')}`
    };
    
    const content = reportContent[type as keyof typeof reportContent] || reportContent.overview;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-${type}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios e Análises</h2>
          <p className="text-gray-600">
            Análise detalhada do seu desempenho financeiro
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onToggleBalances && (
            <Button 
              variant="outline"
              size="sm"
              onClick={onToggleBalances}
            >
              {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showBalances ? 'Ocultar' : 'Mostrar'} Valores
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => generateReport('overview')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Resumo
          </Button>
          <Button 
            size="sm"
            onClick={() => generateReport('detailed')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Relatório Completo
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-green-800">Receitas</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 mb-2">
              {showBalances ? formatCurrency(currentMonthData.income) : '€ •••••'}
            </div>
            <div className="flex items-center">
              {incomeGrowth >= 0 ? <ArrowUpRight className="h-4 w-4 text-green-600" /> : <ArrowDownRight className="h-4 w-4 text-red-600" />}
              <span className={`text-sm ml-1 ${incomeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(incomeGrowth)} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-red-800">Despesas</CardTitle>
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 mb-2">
              {showBalances ? formatCurrency(currentMonthData.expenses) : '€ •••••'}
            </div>
            <div className="flex items-center">
              {expenseGrowth <= 0 ? <ArrowDownRight className="h-4 w-4 text-green-600" /> : <ArrowUpRight className="h-4 w-4 text-red-600" />}
              <span className={`text-sm ml-1 ${expenseGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(expenseGrowth)} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-blue-800">Poupança</CardTitle>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 mb-2">
              {showBalances ? formatCurrency(currentMonthData.savings) : '€ •••••'}
            </div>
            <div className="flex items-center">
              {savingsGrowth >= 0 ? <ArrowUpRight className="h-4 w-4 text-green-600" /> : <ArrowDownRight className="h-4 w-4 text-red-600" />}
              <span className={`text-sm ml-1 ${savingsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(savingsGrowth)} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-purple-800">Taxa de Poupança</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 mb-2">
              {savingsRate.toFixed(1)}%
            </div>
            <div className="text-sm text-purple-700">
              {savingsRate >= 20 ? 'Excelente!' : savingsRate >= 10 ? 'Bom!' : 'Pode melhorar'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Report Content */}
      <Tabs value={activeReport} onValueChange={(value) => setActiveReport(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="income" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Receitas
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Despesas
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tendências
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Saúde Financeira</CardTitle>
                <CardDescription>Indicadores principais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Taxa de Poupança</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(savingsRate, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {savingsRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Ratio de Despesas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(expenseRatio, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-orange-600">
                        {expenseRatio.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {showBalances ? formatCurrency(currentMonthData.netWorth) : '€ •••••'}
                        </p>
                        <p className="text-sm text-gray-600">Patrimônio Líquido</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {reportData.length}
                        </p>
                        <p className="text-sm text-gray-600">Meses de Dados</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Comparação Mensal</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.slice(0, 6).map((month, index) => {
                    const isCurrentMonth = index === 0;
                    return (
                      <div key={month.period} className={`p-3 rounded-lg border ${isCurrentMonth ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-medium ${isCurrentMonth ? 'text-blue-900' : 'text-gray-900'}`}>
                            {month.period}
                          </span>
                          {isCurrentMonth && (
                            <Badge variant="default">Atual</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Receitas</p>
                            <p className="font-semibold text-green-600">
                              {showBalances ? formatCurrency(month.income) : '€ •••'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Despesas</p>
                            <p className="font-semibold text-red-600">
                              {showBalances ? formatCurrency(month.expenses) : '€ •••'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Poupança</p>
                            <p className="font-semibold text-blue-600">
                              {showBalances ? formatCurrency(month.savings) : '€ •••'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Receitas</CardTitle>
              <CardDescription>Distribuição e tendências das receitas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${category.color}`} />
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.percentage.toFixed(1)}% do total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {showBalances ? formatCurrency(category.amount) : '€ •••••'}
                      </p>
                      <div className="flex items-center">
                        {category.trend >= 0 ? 
                          <ArrowUpRight className="h-3 w-3 text-green-500" /> : 
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                        }
                        <span className={`text-xs ml-1 ${category.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(category.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Despesas</CardTitle>
              <CardDescription>Distribuição e tendências das despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${category.color}`} />
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.percentage.toFixed(1)}% do total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {showBalances ? formatCurrency(category.amount) : '€ •••••'}
                      </p>
                      <div className="flex items-center">
                        {category.trend <= 0 ? 
                          <ArrowDownRight className="h-3 w-3 text-green-500" /> : 
                          <ArrowUpRight className="h-3 w-3 text-red-500" />
                        }
                        <span className={`text-xs ml-1 ${category.trend <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(category.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendências Temporais</CardTitle>
              <CardDescription>Evolução ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-700 font-medium">Receitas</p>
                    <p className="text-lg font-bold text-green-800">{formatPercentage(incomeGrowth)}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-red-700 font-medium">Despesas</p>
                    <p className="text-lg font-bold text-red-800">{formatPercentage(expenseGrowth)}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-700 font-medium">Poupança</p>
                    <p className="text-lg font-bold text-blue-800">{formatPercentage(savingsGrowth)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Evolução do Patrimônio Líquido</h4>
                  <div className="space-y-2">
                    {reportData.slice(0, 6).reverse().map((month, index) => {
                      const prevMonth = reportData[reportData.length - index];
                      const growth = prevMonth ? ((month.netWorth - prevMonth.netWorth) / prevMonth.netWorth) * 100 : 0;
                      
                      return (
                        <div key={month.period} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{month.period}</span>
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold text-gray-900">
                              {showBalances ? formatCurrency(month.netWorth) : '€ •••••'}
                            </span>
                            {growth !== 0 && (
                              <div className="flex items-center">
                                {growth >= 0 ? 
                                  <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
                                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                                }
                                <span className={`text-sm ml-1 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatPercentage(growth)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

