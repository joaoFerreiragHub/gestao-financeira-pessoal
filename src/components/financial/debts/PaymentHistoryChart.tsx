// src/components/financial/debts/PaymentHistoryChart.tsx

import React from 'react';

interface MonthlyPayment {
  month: string;
  amount: number;
  count: number;
}

interface PaymentHistoryChartProps {
  monthlyPayments: MonthlyPayment[];
  showBalances: boolean;
  formatCurrency: (amount: number) => string;
}

export const PaymentHistoryChart: React.FC<PaymentHistoryChartProps> = ({
  monthlyPayments,
  showBalances,
  formatCurrency,
}) => {
  if (!monthlyPayments.some(m => m.amount > 0)) {
    return null;
  }

  const maxAmount = Math.max(...monthlyPayments.map(m => m.amount));

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Histórico de Pagamentos (Últimos 6 Meses)
      </h4>
      <div className="space-y-3">
        {monthlyPayments.map((month, index) => {
          const widthPercentage = maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;
          
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm text-gray-600">{month.month}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                <div 
                  className="bg-blue-500 h-6 rounded-full transition-all duration-300"
                  style={{ width: `${widthPercentage}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center px-2">
                  <span className="text-xs font-medium text-white">
                    {month.amount > 0 && showBalances ? formatCurrency(month.amount) : ''}
                  </span>
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">
                {month.count} pag.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};