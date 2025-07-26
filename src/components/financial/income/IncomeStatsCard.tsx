// src/components/income/IncomeStatsCard.tsx

import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { IncomeStats } from '../../../types/income';


interface IncomeStatsCardProps {
  stats: IncomeStats;
  showValues: boolean;
}

export const IncomeStatsCard: React.FC<IncomeStatsCardProps> = ({ stats, showValues }) => {
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-3 w-3 text-green-600" />;
    if (growth < 0) return <ArrowDownRight className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  const getGrowthColor = (growth: number): string => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const cards = [
    {
      title: 'Este Mês',
      value: stats.totalThisMonth,
      icon: TrendingUp,
      growth: stats.growth.monthly,
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
      subtitle: 'vs mês anterior'
    },
    {
      title: 'Este Ano',
      value: stats.totalThisYear,
      icon: BarChart3,
      growth: stats.growth.yearly,
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      subtitle: 'vs ano anterior'
    },
    {
      title: 'Média Mensal',
      value: stats.averageMonthly,
      icon: DollarSign,
      growth: null,
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
      subtitle: 'Últimos 12 meses'
    },
    {
      title: 'Mês Anterior',
      value: stats.totalLastMonth,
      icon: Calendar,
      growth: null,
      bgColor: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600',
      subtitle: 'Comparação'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <div 
            key={index}
            className={`bg-gradient-to-r ${card.bgColor} p-4 rounded-xl border ${card.borderColor} bg-opacity-50`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-medium ${card.textColor} opacity-80`}>
                {card.title}
              </h3>
              <Icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
            
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {showValues ? formatCurrency(card.value) : '€•••••'}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <p className={`text-xs ${card.textColor} opacity-70`}>
                {card.subtitle}
              </p>
              
              {card.growth !== null && (
                <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(card.growth)}`}>
                  {getGrowthIcon(card.growth)}
                  <span>{formatPercentage(card.growth)}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};