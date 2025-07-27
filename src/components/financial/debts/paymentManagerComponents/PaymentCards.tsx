// src/components/financial/debts/PaymentCards.tsx

import React from 'react';
import { Edit3, Trash2, DollarSign, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { DebtEntry, DebtPayment } from '../../../types/debts';

interface PaymentCardsProps {
  payments: DebtPayment[];
  debts: DebtEntry[];
  showBalances: boolean;
  formatCurrency: (amount: number) => string;
  onEditPayment: (payment: DebtPayment) => void;
  onDeletePayment: (payment: DebtPayment) => void;
}

export const PaymentCards: React.FC<PaymentCardsProps> = ({
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