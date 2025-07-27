// src/components/financial/debts/PaymentStatsCards.tsx

import React from 'react';
import { DollarSign, Calendar, TrendingDown, TrendingUp } from 'lucide-react';

interface PaymentStatsCardsProps {
  stats: {
    totalAmount: number;
    totalPrincipal: number;
    totalInterest: number;
    averagePayment: number;
    paymentCount: number;
  };
  showBalances: boolean;
  formatCurrency: (amount: number) => string;
}

export const PaymentStatsCards: React.FC<PaymentStatsCardsProps> = ({
  stats,
  showBalances,
  formatCurrency,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Pago</p>
            <p className="text-xl font-bold text-blue-600">
              {showBalances ? formatCurrency(stats.totalAmount) : '€•••••'}
            </p>
            <p className="text-xs text-gray-500">
              {stats.paymentCount} pagamentos
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Principal Pago</p>
            <p className="text-xl font-bold text-green-600">
              {showBalances ? formatCurrency(stats.totalPrincipal) : '€•••••'}
            </p>
            <p className="text-xs text-gray-500">
              {((stats.totalPrincipal / stats.totalAmount) * 100 || 0).toFixed(1)}% do total
            </p>
          </div>
          <TrendingDown className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Juros Pagos</p>
            <p className="text-xl font-bold text-red-600">
              {showBalances ? formatCurrency(stats.totalInterest) : '€•••••'}
            </p>
            <p className="text-xs text-gray-500">
              {((stats.totalInterest / stats.totalAmount) * 100 || 0).toFixed(1)}% do total
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Média por Pagamento</p>
            <p className="text-xl font-bold text-purple-600">
              {showBalances ? formatCurrency(stats.averagePayment) : '€•••••'}
            </p>
            <p className="text-xs text-gray-500">
              {stats.paymentCount} pagamentos
            </p>
          </div>
          <Calendar className="h-8 w-8 text-purple-500" />
        </div>
      </div>
    </div>
  );
};