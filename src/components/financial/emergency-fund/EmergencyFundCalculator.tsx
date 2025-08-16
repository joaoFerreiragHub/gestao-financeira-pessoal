import React from 'react';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface Calculations {
  targetAmount: number;
  remaining: number;
  monthsToComplete: number;
}

interface EmergencyFundCalculatorProps {
  monthlyContribution: number;
  setMonthlyContribution: (value: number) => void;
  targetMonths: number;
  setTargetMonths: (value: number) => void;
  calculations: Calculations;
  monthlySavings: number;
  formatCurrency: (value: number) => string;
}

export const EmergencyFundCalculator: React.FC<EmergencyFundCalculatorProps> = ({
  monthlyContribution,
  setMonthlyContribution,
  targetMonths,
  setTargetMonths,
  calculations,
  monthlySavings,
  formatCurrency
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Planeamento de Contribuições</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contribuição Mensal
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="200"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Recomendado: {formatCurrency(monthlySavings * 0.3)} (30% das poupanças)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meses para Meta
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={targetMonths}
              onChange={(e) => setTargetMonths(Number(e.target.value))}
              min="3"
              max="12"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Entre 3-12 meses de despesas
          </p>
        </div>
      </div>

      {/* Projeção */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-blue-900">Projeção</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Tempo para meta:</span>
            <p className="font-semibold text-blue-900">
              {calculations.monthsToComplete > 0 ? `${calculations.monthsToComplete} meses` : 'Meta atingida'}
            </p>
          </div>
          <div>
            <span className="text-blue-700">Data estimada:</span>
            <p className="font-semibold text-blue-900">
              {calculations.monthsToComplete > 0 ? 
                new Date(Date.now() + calculations.monthsToComplete * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT') 
                : 'Já atingida'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};