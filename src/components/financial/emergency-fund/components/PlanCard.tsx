import React from 'react';
import { CheckCircle } from 'lucide-react';

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
  const monthsToComplete = monthlyContribution > 0 ? 
    Math.ceil((targetAmount - currentAmount) / monthlyContribution) : 0;

  return (
    <div 
      onClick={() => onSelect(plan)}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? `border-${plan.color}-500 bg-${plan.color}-50 shadow-lg` 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-12 h-12 bg-${plan.color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`h-6 w-6 text-${plan.color}-600`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
          <p className="text-sm text-gray-600">{plan.months} meses de despesas</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Meta:</span>
          <span className="font-semibold">
            {showBalances ? formatCurrency(targetAmount) : '••••••'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Falta:</span>
          <span className="font-semibold text-orange-600">
            {showBalances ? formatCurrency(Math.max(0, targetAmount - currentAmount)) : '••••••'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tempo estimado:</span>
          <span className="font-semibold text-blue-600">
            {monthsToComplete > 0 ? `${monthsToComplete} meses` : 'Meta atingida'}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Nível de risco: {plan.riskLevel}</span>
          {isSelected && (
            <div className={`flex items-center space-x-1 text-${plan.color}-600`}>
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Selecionado</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};