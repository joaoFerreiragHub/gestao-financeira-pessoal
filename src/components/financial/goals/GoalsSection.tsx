import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Plus, 
  Calendar,
  Trophy,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Flag
} from 'lucide-react';

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';

// Types
interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  type: 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'emergency_fund';
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  category: string;
  monthlyContribution?: number;
}

interface GoalsSectionProps {
  showBalances: boolean;
  onToggleBalances?: () => void;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({
  showBalances,
  onToggleBalances
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Sample data - in real app this would come from hooks/context
  const [goals] = useState<FinancialGoal[]>([
    {
      id: '1',
      title: 'Fundo de Emergência',
      description: 'Criar reserva para 6 meses de despesas',
      type: 'emergency_fund',
      targetAmount: 15000,
      currentAmount: 8500,
      deadline: '2025-12-31',
      priority: 'high',
      status: 'active',
      createdAt: '2024-06-01',
      category: 'Segurança Financeira',
      monthlyContribution: 800
    },
    {
      id: '2',
      title: 'Entrada para Casa',
      description: 'Poupar para entrada de 20% do imóvel',
      type: 'purchase',
      targetAmount: 40000,
      currentAmount: 12300,
      deadline: '2026-06-30',
      priority: 'high',
      status: 'active',
      createdAt: '2024-03-15',
      category: 'Habitação',
      monthlyContribution: 1200
    },
    {
      id: '3',
      title: 'Quitar Cartão de Crédito',
      description: 'Eliminar dívida do cartão completamente',
      type: 'debt_payoff',
      targetAmount: 3500,
      currentAmount: 2100,
      deadline: '2025-08-31',
      priority: 'medium',
      status: 'active',
      createdAt: '2024-11-01',
      category: 'Dívidas',
      monthlyContribution: 400
    },
    {
      id: '4',
      title: 'Férias na Europa',
      description: 'Viagem de 2 semanas pelo continente',
      type: 'purchase',
      targetAmount: 3000,
      currentAmount: 3000,
      deadline: '2024-07-01',
      priority: 'low',
      status: 'completed',
      createdAt: '2023-12-01',
      category: 'Entretenimento'
    },
    {
      id: '5',
      title: 'Carteira de Investimentos',
      description: 'Diversificar investimentos em ETFs',
      type: 'investment',
      targetAmount: 25000,
      currentAmount: 5600,
      deadline: '2027-12-31',
      priority: 'medium',
      status: 'active',
      createdAt: '2024-01-01',
      category: 'Investimentos',
      monthlyContribution: 600
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getGoalTypeIcon = (type: FinancialGoal['type']) => {
    switch (type) {
      case 'savings': return <DollarSign className="h-4 w-4" />;
      case 'debt_payoff': return <Target className="h-4 w-4" />;
      case 'investment': return <TrendingUp className="h-4 w-4" />;
      case 'purchase': return <Trophy className="h-4 w-4" />;
      case 'emergency_fund': return <Flag className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getGoalTypeLabel = (type: FinancialGoal['type']) => {
    switch (type) {
      case 'savings': return 'Poupança';
      case 'debt_payoff': return 'Quitação de Dívida';
      case 'investment': return 'Investimento';
      case 'purchase': return 'Compra';
      case 'emergency_fund': return 'Fundo de Emergência';
      default: return type;
    }
  };

  const getPriorityColor = (priority: FinancialGoal['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: FinancialGoal['priority']) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateTimeLeft = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Atrasado';
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return '1 dia';
    if (diffDays < 30) return `${diffDays} dias`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} meses`;
    return `${Math.ceil(diffDays / 365)} anos`;
  };

  const calculateMonthsToGoal = (current: number, target: number, monthlyContribution: number) => {
    if (monthlyContribution <= 0) return Infinity;
    const remaining = target - current;
    return Math.ceil(remaining / monthlyContribution);
  };

  // Filter goals based on active tab
  const filteredGoals = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return goals.filter(goal => goal.status === 'active');
      case 'completed':
        return goals.filter(goal => goal.status === 'completed');
      default:
        return goals;
    }
  }, [goals, activeTab]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    
    const totalTargetAmount = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalMonthlyContributions = activeGoals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0);
    
    const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
    
    return {
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      totalTargetAmount,
      totalCurrentAmount,
      totalMonthlyContributions,
      overallProgress
    };
  }, [goals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Metas Financeiras</h2>
          <p className="text-gray-600">
            Defina e acompanhe seus objetivos financeiros
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
            onClick={() => setShowGoalForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-800">Metas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{stats.activeGoals}</div>
            <p className="text-sm text-blue-700">Em progresso</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{stats.completedGoals}</div>
            <p className="text-sm text-green-700">Objetivos alcançados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-800">Progresso Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{stats.overallProgress.toFixed(1)}%</div>
            <div className="mt-2">
              <Progress value={stats.overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-orange-800">Contribuição Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {showBalances ? formatCurrency(stats.totalMonthlyContributions) : '€ •••'}
            </div>
            <p className="text-sm text-orange-700">Para todas as metas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'active', label: 'Ativas', count: stats.activeGoals },
            { id: 'completed', label: 'Concluídas', count: stats.completedGoals },
            { id: 'all', label: 'Todas', count: goals.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              <Badge variant="secondary">{tab.count}</Badge>
            </button>
          ))}
        </nav>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const timeLeft = calculateTimeLeft(goal.deadline);
          const isOverdue = new Date(goal.deadline) < new Date() && goal.status !== 'completed';
          const monthsToGoal = goal.monthlyContribution ? calculateMonthsToGoal(goal.currentAmount, goal.targetAmount, goal.monthlyContribution) : null;

          return (
            <Card key={goal.id} className={`${goal.status === 'completed' ? 'bg-green-50 border-green-200' : ''} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getGoalTypeIcon(goal.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getPriorityColor(goal.priority)}>
                          {getPriorityLabel(goal.priority)}
                        </Badge>
                        <Badge variant="outline">
                          {getGoalTypeLabel(goal.type)}
                        </Badge>
                        {goal.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Concluída
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso</span>
                    <span className="text-sm font-semibold text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-600">
                      {showBalances ? formatCurrency(goal.currentAmount) : '€ •••••'}
                    </span>
                    <span className="text-gray-600">
                      {showBalances ? formatCurrency(goal.targetAmount) : '€ •••••'}
                    </span>
                  </div>
                </div>

                {/* Time Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Prazo</p>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
                        {formatDate(goal.deadline)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Tempo Restante</p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
                        {timeLeft}
                      </span>
                      {isOverdue && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                </div>

                {/* Monthly Contribution & Projection */}
                {goal.monthlyContribution && goal.status !== 'completed' && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Contribuição Mensal</p>
                        <p className="font-semibold text-green-600">
                          {showBalances ? formatCurrency(goal.monthlyContribution) : '€ •••'}
                        </p>
                      </div>
                      {monthsToGoal && monthsToGoal !== Infinity && (
                        <div>
                          <p className="text-gray-600 mb-1">Previsão</p>
                          <p className="font-semibold text-blue-600">
                            {monthsToGoal} {monthsToGoal === 1 ? 'mês' : 'meses'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {goal.status !== 'completed' && (
                  <div className="flex space-x-2 pt-2 border-t border-gray-200">
                    <Button size="sm" variant="outline" className="flex-1">
                      Adicionar Valor
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Ajustar Meta
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredGoals.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'active' ? 'Nenhuma meta ativa' : 
               activeTab === 'completed' ? 'Nenhuma meta concluída' : 
               'Nenhuma meta encontrada'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'active' ? 'Comece definindo seus objetivos financeiros' : 
               activeTab === 'completed' ? 'Complete suas primeiras metas para vê-las aqui' : 
               'Crie sua primeira meta financeira'}
            </p>
            <Button onClick={() => setShowGoalForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Nova Meta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

