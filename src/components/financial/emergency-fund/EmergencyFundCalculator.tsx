// src/components/financial/emergency-fund/EmergencyFundCalculator.tsx
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface EmergencyFundCalculatorProps {
  monthlyExpenses: number;
  currentAmount: number;
  targetMonths: number;
  showBalances: boolean;
  formatCurrency: (value: number) => string;
  onCalculationUpdate: (data: {
    monthlyContribution: number;
    monthsToGoal: number;
    totalNeeded: number;
  }) => void;
}

export const EmergencyFundCalculator: React.FC<EmergencyFundCalculatorProps> = ({
  monthlyExpenses,
  currentAmount,
  targetMonths,
  showBalances,
  formatCurrency,
  onCalculationUpdate
}) => {
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [customTargetMonths, setCustomTargetMonths] = useState(targetMonths);
  const [calculationMode, setCalculationMode] = useState<'contribution' | 'timeline'>('contribution');

  const targetAmount = monthlyExpenses * customTargetMonths;
  const remaining = Math.max(0, targetAmount - currentAmount);
  
  const monthsToGoal = monthlyContribution > 0 ? Math.ceil(remaining / monthlyContribution) : 0;
  const recommendedContribution = monthsToGoal > 0 ? remaining / 12 : 0; // Para atingir em 1 ano

  useEffect(() => {
    onCalculationUpdate({
      monthlyContribution,
      monthsToGoal,
      totalNeeded: remaining
    });
  }, [monthlyContribution, monthsToGoal, remaining, onCalculationUpdate]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Calculator className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Calculadora do Fundo</h3>
          <p className="text-sm text-gray-600">Planeie a sua estratégia de poupança</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setCalculationMode('contribution')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            calculationMode === 'contribution'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Por Contribuição
        </button>
        <button
          onClick={() => setCalculationMode('timeline')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            calculationMode === 'timeline'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Por Prazo
        </button>
      </div>

      <div className="space-y-4">
        {/* Target Months Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meses de cobertura desejados
          </label>
          <input
            type="number"
            min="1"
            max="24"
            value={customTargetMonths}
            onChange={(e) => setCustomTargetMonths(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Monthly Contribution Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contribuição mensal (€)
          </label>
          <input
            type="number"
            min="0"
            step="10"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Meta Total</span>
            </div>
            <p className="text-lg font-bold text-blue-900">
              {showBalances ? formatCurrency(targetAmount) : '€ ••••••'}
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Ainda Falta</span>
            </div>
            <p className="text-lg font-bold text-orange-900">
              {showBalances ? formatCurrency(remaining) : '€ ••••••'}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Tempo Estimado</span>
            </div>
            <p className="text-lg font-bold text-green-900">
              {monthsToGoal > 0 ? `${monthsToGoal} meses` : 'Meta atingida'}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {recommendedContribution > 0 && (
          <div className="bg-indigo-50 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-indigo-900 mb-2">💡 Recomendação</h4>
            <p className="text-sm text-indigo-800">
              Para atingir a meta em 12 meses, recomendamos uma contribuição mensal de{' '}
              <span className="font-bold">
                {showBalances ? formatCurrency(recommendedContribution) : '€ •••'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};