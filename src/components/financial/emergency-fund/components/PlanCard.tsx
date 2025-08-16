// src/components/financial/emergency-fund/components/PlanCard.tsx
import React from 'react';
import { CheckCircle, Shield, Target, Zap } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  months: number;
  description: string;
  icon: any;
  color: string;
  riskLevel: string;
}

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  monthlyExpenses: number;
  currentAmount: number;
  monthlyContribution: number;
  showBalances: boolean;
  formatCurrency: (value: number) => string;
  onSelect: (plan: Plan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isSelected,
  monthlyExpenses,
  currentAmount,
  monthlyContribution,
  showBalances,
  formatCurrency,
  onSelect
}) => {
  const Icon = plan.icon;
  const targetAmount = monthlyExpenses * plan.months;
  const remaining = Math.max(0, targetAmount - currentAmount);
  const monthsToComplete = monthlyContribution > 0 ? 
    Math.ceil(remaining / monthlyContribution) : 0;
  const progressPercentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

  const getColorClasses = () => {
    switch (plan.color) {
      case 'blue':
        return {
          border: isSelected ? 'border-blue-500' : 'border-gray-200',
          bg: isSelected ? 'bg-blue-50' : 'bg-white',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600',
          accent: 'text-blue-600',
          hover: 'hover:border-blue-300'
        };
      case 'green':
        return {
          border: isSelected ? 'border-green-500' : 'border-gray-200',
          bg: isSelected ? 'bg-green-50' : 'bg-white',
          iconBg: 'bg-green-100',
          iconText: 'text-green-600',
          accent: 'text-green-600',
          hover: 'hover:border-green-300'
        };
      case 'orange':
        return {
          border: isSelected ? 'border-orange-500' : 'border-gray-200',
          bg: isSelected ? 'bg-orange-50' : 'bg-white',
          iconBg: 'bg-orange-100',
          iconText: 'text-orange-600',
          accent: 'text-orange-600',
          hover: 'hover:border-orange-300'
        };
      default:
        return {
          border: isSelected ? 'border-gray-500' : 'border-gray-200',
          bg: isSelected ? 'bg-gray-50' : 'bg-white',
          iconBg: 'bg-gray-100',
          iconText: 'text-gray-600',
          accent: 'text-gray-600',
          hover: 'hover:border-gray-300'
        };
    }
  };

  const colors = getColorClasses();
  const isCompleted = currentAmount >= targetAmount;

  return (
    <div 
      onClick={() => onSelect(plan)}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${colors.border} ${colors.bg} ${colors.hover} ${
        isSelected ? 'shadow-lg transform scale-[1.02]' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${colors.iconText}`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
          <p className="text-sm text-gray-600">{plan.months} meses de despesas</p>
        </div>
        {isSelected && (
          <div className={`ml-auto ${colors.accent}`}>
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

      {/* Barra de Progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progresso</span>
          <span>{Math.min(progressPercentage, 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : colors.iconText.replace('text-', 'bg-')
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Meta:</span>
          <span className="font-semibold">
            {showBalances ? formatCurrency(targetAmount) : '€ ••••••'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Atual:</span>
          <span className={`font-semibold ${colors.accent}`}>
            {showBalances ? formatCurrency(currentAmount) : '€ ••••••'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Falta:</span>
          <span className="font-semibold text-orange-600">
            {showBalances ? formatCurrency(remaining) : '€ ••••••'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tempo estimado:</span>
          <span className="font-semibold text-blue-600">
            {isCompleted ? 'Meta atingida!' :
             monthsToComplete > 0 ? `${monthsToComplete} meses` : 'Indefinido'}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Nível de risco: {plan.riskLevel}</span>
          {isCompleted && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Completo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};