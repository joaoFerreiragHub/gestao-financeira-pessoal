// src/components/financial/debts/PaymentTable.tsx

import React from 'react';
import { Edit3, Trash2, Calendar, DollarSign, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { DebtEntry, DebtPayment } from '../../../types/debts';

interface PaymentTableProps {
  payments: DebtPayment[];
  debts: DebtEntry[];
  showBalances: boolean;
  formatCurrency: (amount: number) => string;
  onEditPayment: (payment: DebtPayment) => void;
  onDeletePayment: (payment: DebtPayment) => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  debts,
  showBalances,
  formatCurrency,
  onEditPayment,
  onDeletePayment,
}) => {
  const getDebtInfo = (debtId: string) => {
    return debts.find(d => d.id === debtId);
  };

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case 'mixed': return 'Misto';
      case 'interest': return 'Juros';
      case 'principal': return 'Principal';
      case 'extra': return 'Extra';
      default: return type;
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'mixed': return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'interest': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'principal': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'extra': return <Target className="h-4 w-4 text-purple-500" />;
      default: return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  const sortedPayments = payments.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dívida
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Composição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedPayments.map((payment) => {
            const debt = getDebtInfo(payment.debtId);
            
            return (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {debt?.creditorName || 'Dívida não encontrada'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {debt?.categoryName || ''}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {showBalances ? formatCurrency(payment.amount) : '€•••••'}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getPaymentTypeIcon(payment.paymentType)}
                    <span className="ml-2 text-sm text-gray-900">
                      {getPaymentTypeText(payment.paymentType)}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-600">
                    <div className="flex items-center mb-1">
                      <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                      Principal: {showBalances ? formatCurrency(payment.principalAmount) : '€•••••'}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                      Juros: {showBalances ? formatCurrency(payment.interestAmount) : '€•••••'}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditPayment(payment)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Editar pagamento"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeletePayment(payment)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Eliminar pagamento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};