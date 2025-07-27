// src/components/financial/debts/DebtStrategyManager.tsx

import React, { useState, useMemo } from 'react';
import { Target, TrendingDown, Calculator, Clock, Zap, DollarSign, BarChart3, AlertTriangle } from 'lucide-react';
import { DebtEntry, DebtStats } from '../../../types/debts';

interface DebtStrategyManagerProps {
  debts: DebtEntry[];
  stats: DebtStats;
  showBalances: boolean;
  formatCurrency: (amount: number) => string;
}

interface StrategyResult {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  totalTime: number; // meses
  totalInterest: number;
  totalPayments: number;
  monthlyIncrease?: number;
  paymentPlan: Array<{
    debtId: string;
    debtName: string;
    priority: number;
    suggestedPayment: number;
    currentPayment: number;
    reasoning: string;
  }>;
}

export const DebtStrategyManager: React.FC<DebtStrategyManagerProps> = ({
  debts,
  stats,
  showBalances,
  formatCurrency,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('avalanche');
  const [extraPayment, setExtraPayment] = useState<number>(100);
  const [targetMonths, setTargetMonths] = useState<number>(36);

  const activeDebts = debts.filter(debt => debt.isActive && debt.currentBalance > 0);

  // Estratégia Avalanche (maior taxa de juro primeiro)
  const avalancheStrategy = useMemo((): StrategyResult => {
    const sortedDebts = [...activeDebts].sort((a, b) => b.interestRate - a.interestRate);
    let totalInterest = 0;
    let totalTime = 0;
    
    const paymentPlan = sortedDebts.map((debt, index) => {
      // Apenas a primeira dívida (prioridade máxima) recebe o pagamento extra
      const extraForThisDebt = index === 0 ? extraPayment : 0;
      const suggestedPayment = debt.monthlyPayment + extraForThisDebt;
      
      // Cálculo simplificado do tempo para pagar esta dívida
      const monthlyRate = debt.interestRate / 100 / 12;
      let months = 0;
      
      if (monthlyRate > 0) {
        months = Math.ceil(
          -Math.log(1 - (debt.currentBalance * monthlyRate) / suggestedPayment) / 
          Math.log(1 + monthlyRate)
        );
      } else {
        months = Math.ceil(debt.currentBalance / suggestedPayment);
      }
      
      if (isNaN(months) || !isFinite(months)) months = 0;
      
      const interestForDebt = (suggestedPayment * months) - debt.currentBalance;
      totalInterest += Math.max(0, interestForDebt);
      totalTime = Math.max(totalTime, months);
      
      return {
        debtId: debt.id,
        debtName: debt.creditorName,
        priority: index + 1,
        suggestedPayment,
        currentPayment: debt.monthlyPayment,
        reasoning: index === 0 
          ? `Prioridade máxima - maior taxa (${debt.interestRate}%)`
          : `Prioridade ${index + 1} - taxa ${debt.interestRate}%`,
      };
    });

    return {
      name: 'Avalanche',
      description: 'Pague primeiro as dívidas com maiores taxas de juro',
      icon: <Target className="h-5 w-5" />,
      color: 'blue',
      totalTime,
      totalInterest,
      totalPayments: stats.totalMonthlyPayments + extraPayment,
      paymentPlan,
    };
  }, [activeDebts, extraPayment, stats.totalMonthlyPayments]);

  // Estratégia Snowball (menor saldo primeiro)
  const snowballStrategy = useMemo((): StrategyResult => {
    const sortedDebts = [...activeDebts].sort((a, b) => a.currentBalance - b.currentBalance);
    let totalInterest = 0;
    let totalTime = 0;
    
    const paymentPlan = sortedDebts.map((debt, index) => {
      // Apenas a primeira dívida (menor saldo) recebe o pagamento extra
      const extraForThisDebt = index === 0 ? extraPayment : 0;
      const suggestedPayment = debt.monthlyPayment + extraForThisDebt;
      
      const monthlyRate = debt.interestRate / 100 / 12;
      let months = 0;
      
      if (monthlyRate > 0) {
        months = Math.ceil(
          -Math.log(1 - (debt.currentBalance * monthlyRate) / suggestedPayment) / 
          Math.log(1 + monthlyRate)
        );
      } else {
        months = Math.ceil(debt.currentBalance / suggestedPayment);
      }
      
      if (isNaN(months) || !isFinite(months)) months = 0;
      
      const interestForDebt = (suggestedPayment * months) - debt.currentBalance;
      totalInterest += Math.max(0, interestForDebt);
      totalTime = Math.max(totalTime, months);
      
      return {
        debtId: debt.id,
        debtName: debt.creditorName,
        priority: index + 1,
        suggestedPayment,
        currentPayment: debt.monthlyPayment,
        reasoning: index === 0 
          ? `Prioridade máxima - menor saldo (${formatCurrency(debt.currentBalance)})`
          : `Prioridade ${index + 1} - saldo ${formatCurrency(debt.currentBalance)}`,
      };
    });

    return {
      name: 'Snowball',
      description: 'Pague primeiro as dívidas com menores saldos',
      icon: <Zap className="h-5 w-5" />,
      color: 'green',
      totalTime,
      totalInterest,
      totalPayments: stats.totalMonthlyPayments + extraPayment,
      paymentPlan,
    };
  }, [activeDebts, extraPayment, stats.totalMonthlyPayments, formatCurrency]);

  // Estratégia de Tempo Fixo
  const timeBasedStrategy = useMemo((): StrategyResult => {
    const totalDebt = activeDebts.reduce((sum, debt) => sum + debt.currentBalance, 0);
    const requiredMonthlyPayment = totalDebt / targetMonths;
    const currentPayments = stats.totalMonthlyPayments;
    const additionalNeeded = Math.max(0, requiredMonthlyPayment - currentPayments);
    
    // Distribuir o pagamento adicional proporcionalmente
    const paymentPlan = activeDebts.map((debt, index) => {
      const proportion = debt.currentBalance / totalDebt;
      const additionalPayment = additionalNeeded * proportion;
      const suggestedPayment = debt.monthlyPayment + additionalPayment;
      
      return {
        debtId: debt.id,
        debtName: debt.creditorName,
        priority: index + 1,
        suggestedPayment,
        currentPayment: debt.monthlyPayment,
        reasoning: `Pagamento proporcional para quitar em ${targetMonths} meses`,
      };
    });

    // Estimativa simples dos juros
    const avgInterestRate = totalDebt > 0 ? 
      activeDebts.reduce((sum, debt) => sum + (debt.interestRate * debt.currentBalance), 0) / totalDebt : 0;
    const estimatedInterest = (requiredMonthlyPayment * targetMonths) - totalDebt;

    return {
      name: 'Tempo Fixo',
      description: `Quite todas as dívidas em ${targetMonths} meses`,
      icon: <Clock className="h-5 w-5" />,
      color: 'purple',
      totalTime: targetMonths,
      totalInterest: Math.max(0, estimatedInterest),
      totalPayments: requiredMonthlyPayment,
      monthlyIncrease: additionalNeeded,
      paymentPlan,
    };
  }, [activeDebts, targetMonths, stats.totalMonthlyPayments]);

  // Estratégia Equilibrada
  const balancedStrategy = useMemo((): StrategyResult => {
    // Combinação de avalanche e snowball
    const paymentPlan = activeDebts
      .map(debt => {
        // Score baseado em taxa de juro e facilidade de quitação
        const interestScore = debt.interestRate / 30; // Normalizar
        const balanceScore = (1 / debt.currentBalance) * 10000; // Inverso do saldo
        const combinedScore = (interestScore * 0.6) + (balanceScore * 0.4);
        
        return { ...debt, score: combinedScore };
      })
      .sort((a, b) => b.score - a.score)
      .map((debt, index) => {
        // Apenas a primeira dívida (melhor score) recebe o pagamento extra
        const extraForThisDebt = index === 0 ? extraPayment : 0;
        const suggestedPayment = debt.monthlyPayment + extraForThisDebt;
        
        return {
          debtId: debt.id,
          debtName: debt.creditorName,
          priority: index + 1,
          suggestedPayment,
          currentPayment: debt.monthlyPayment,
          reasoning: index === 0 
            ? `Melhor relação entre taxa (${debt.interestRate}%) e saldo`
            : `Prioridade ${index + 1} no ranking equilibrado`,
        };
      });

    // Cálculo simplificado baseado na média das outras estratégias
    const avgTime = (avalancheStrategy.totalTime + snowballStrategy.totalTime) / 2;
    const avgInterest = (avalancheStrategy.totalInterest + snowballStrategy.totalInterest) / 2;

    return {
      name: 'Equilibrada',
      description: 'Combina taxa de juro e momentum psicológico',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'orange',
      totalTime: avgTime,
      totalInterest: avgInterest,
      totalPayments: stats.totalMonthlyPayments + extraPayment,
      paymentPlan,
    };
  }, [activeDebts, extraPayment, avalancheStrategy, snowballStrategy, stats.totalMonthlyPayments]);

  const strategies = {
    avalanche: avalancheStrategy,
    snowball: snowballStrategy,
    timeBased: timeBasedStrategy,
    balanced: balancedStrategy,
  };

  const currentStrategy = strategies[selectedStrategy as keyof typeof strategies];

  const getStrategyColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStrategyIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const formatTime = (months: number) => {
    if (months <= 0) return 'N/A';
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);
    
    if (years === 0) return `${remainingMonths}m`;
    if (remainingMonths === 0) return `${years}a`;
    return `${years}a ${remainingMonths}m`;
  };

  const getSavingsVsCurrent = (strategy: StrategyResult) => {
    const currentProjectedInterest = stats.payoffProjection.totalInterest;
    const savings = currentProjectedInterest - strategy.totalInterest;
    const timeSavings = stats.payoffProjection.months - strategy.totalTime;
    
    return { savings, timeSavings };
  };

  if (activeDebts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Parabéns!</h3>
        <p className="text-gray-600">
          Não tem dívidas ativas para gerir. Continue assim!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Estratégias de Quitação</h3>
        <p className="text-sm text-gray-600">
          Compare diferentes estratégias para quitar as suas dívidas de forma eficiente
        </p>
      </div>

      {/* Configurações */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Configurações da Estratégia</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pagamento Extra Mensal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">€</span>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value) || 0)}
                min="0"
                step="10"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Valor adicional que pode pagar mensalmente
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta de Tempo (meses)
            </label>
            <input
              type="number"
              value={targetMonths}
              onChange={(e) => setTargetMonths(Number(e.target.value) || 36)}
              min="6"
              max="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Para a estratégia de tempo fixo
            </p>
          </div>
        </div>
      </div>

      {/* Seleção de Estratégia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(strategies).map(([key, strategy]) => {
          const isSelected = selectedStrategy === key;
          const { savings, timeSavings } = getSavingsVsCurrent(strategy);
          
          return (
            <button
              key={key}
              onClick={() => setSelectedStrategy(key)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                isSelected 
                  ? `${getStrategyColor(strategy.color)} border-current` 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
                  <div className={isSelected ? getStrategyIconColor(strategy.color) : 'text-gray-600'}>
                    {strategy.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{strategy.name}</h4>
                  <p className="text-xs text-gray-600">{strategy.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tempo:</span>
                  <span className="font-medium">{formatTime(strategy.totalTime)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Juros:</span>
                  <span className="font-medium">
                    {showBalances ? formatCurrency(strategy.totalInterest) : '€•••••'}
                  </span>
                </div>
                {strategy.monthlyIncrease && strategy.monthlyIncrease > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Aumento:</span>
                    <span className="font-medium text-orange-600">
                      +{showBalances ? formatCurrency(strategy.monthlyIncrease) : '€•••••'}
                    </span>
                  </div>
                )}
                {savings > 0 && (
                  <div className="pt-2 border-t border-current border-opacity-20">
                    <p className="text-xs text-green-600">
                      Economiza {showBalances ? formatCurrency(savings) : '€•••••'}
                      {timeSavings > 0 && ` e ${formatTime(timeSavings)}`}
                    </p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalhes da Estratégia Selecionada */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className={`p-6 ${getStrategyColor(currentStrategy.color)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-lg">
                <div className={getStrategyIconColor(currentStrategy.color)}>
                  {currentStrategy.icon}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Estratégia {currentStrategy.name}
                </h3>
                <p className="text-gray-700">{currentStrategy.description}</p>
              </div>
            </div>
          </div>

          {/* Métricas da Estratégia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Tempo Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(currentStrategy.totalTime)}
              </p>
              <p className="text-sm text-gray-600">
                vs {formatTime(stats.payoffProjection.months)} atual
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span className="font-medium text-gray-900">Juros Totais</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {showBalances ? formatCurrency(currentStrategy.totalInterest) : '€•••••'}
              </p>
              <p className="text-sm text-gray-600">
                vs {showBalances ? formatCurrency(stats.payoffProjection.totalInterest) : '€•••••'} atual
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Pagamento Mensal</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {showBalances ? formatCurrency(currentStrategy.totalPayments) : '€•••••'}
              </p>
              {currentStrategy.monthlyIncrease && currentStrategy.monthlyIncrease > 0 && (
                <p className="text-sm text-orange-600">
                  +{showBalances ? formatCurrency(currentStrategy.monthlyIncrease) : '€•••••'} vs atual
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Plano de Pagamento */}
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Plano de Pagamento</h4>
          
          <div className="space-y-4">
            {currentStrategy.paymentPlan.map((plan, index) => {
              const debt = activeDebts.find(d => d.id === plan.debtId);
              const increase = plan.suggestedPayment - plan.currentPayment;
              
              return (
                <div key={plan.debtId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        index === 0 ? 'bg-red-500' : 
                        index === 1 ? 'bg-orange-500' : 
                        index === 2 ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}>
                        {plan.priority}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{plan.debtName}</h5>
                        <p className="text-sm text-gray-600">{plan.reasoning}</p>
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <div className="flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        <Target className="h-3 w-3 mr-1" />
                        Foco Principal
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Saldo Atual</p>
                      <p className="font-medium text-red-600">
                        {debt && showBalances ? formatCurrency(debt.currentBalance) : '€•••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Pagamento Atual</p>
                      <p className="font-medium text-gray-900">
                        {showBalances ? formatCurrency(plan.currentPayment) : '€•••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Pagamento Sugerido</p>
                      <p className="font-medium text-blue-600">
                        {showBalances ? formatCurrency(plan.suggestedPayment) : '€•••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Aumento</p>
                      <p className={`font-medium ${increase > 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                        {increase > 0 
                          ? `+${showBalances ? formatCurrency(increase) : '€•••••'}`
                          : 'Sem alteração'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {debt && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Taxa de Juro:</span>
                        <span className="font-medium">{debt.interestRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparação de Estratégias */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparação de Estratégias</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-900">Estratégia</th>
                  <th className="text-right py-2 font-medium text-gray-900">Tempo</th>
                  <th className="text-right py-2 font-medium text-gray-900">Juros Totais</th>
                  <th className="text-right py-2 font-medium text-gray-900">Pagamento Mensal</th>
                  <th className="text-right py-2 font-medium text-gray-900">Economia</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(strategies).map(([key, strategy]) => {
                  const { savings } = getSavingsVsCurrent(strategy);
                  const isSelected = selectedStrategy === key;
                  
                  return (
                    <tr key={key} className={`border-b border-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div className={isSelected ? getStrategyIconColor(strategy.color) : 'text-gray-500'}>
                            {strategy.icon}
                          </div>
                          <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                            {strategy.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-3 text-gray-900">
                        {formatTime(strategy.totalTime)}
                      </td>
                      <td className="text-right py-3 text-gray-900">
                        {showBalances ? formatCurrency(strategy.totalInterest) : '€•••••'}
                      </td>
                      <td className="text-right py-3 text-gray-900">
                        {showBalances ? formatCurrency(strategy.totalPayments) : '€•••••'}
                      </td>
                      <td className="text-right py-3">
                        {savings > 0 ? (
                          <span className="text-green-600 font-medium">
                            {showBalances ? formatCurrency(savings) : '€•••••'}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dicas e Avisos */}
        <div className="p-6 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-yellow-800 mb-2">Dicas Importantes</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• As estratégias Avalanche e Equilibrada são matematicamente mais eficientes</li>
                <li>• A estratégia Snowball pode ser melhor psicologicamente (vitórias rápidas)</li>
                <li>• Considere a sua situação financeira antes de aumentar pagamentos</li>
                <li>• Mantenha sempre um fundo de emergência antes de acelerar pagamentos</li>
                <li>• Os cálculos são estimativas - consulte o seu banco para valores exatos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};