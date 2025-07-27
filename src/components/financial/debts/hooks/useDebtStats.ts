// src/components/financial/debts/hooks/useDebtStats.ts

import { useMemo } from 'react';
import { DebtEntry, DebtCategory, DebtPayment, DebtStats, UseDebtStatsReturn } from '../../../../types/debts';

export const useDebtStats = (
  debts: DebtEntry[], 
  categories: DebtCategory[],
  payments: DebtPayment[]
): UseDebtStatsReturn => {
  
  const stats = useMemo((): DebtStats => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Filtrar apenas dívidas ativas
    const activeDebts = debts.filter(debt => debt.isActive);

    // Cálculos básicos
    const totalDebt = activeDebts.reduce((sum, debt) => sum + debt.currentBalance, 0);
    const totalMonthlyPayments = activeDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);

    // Cálculos de juros e principal pagos este ano
    const thisYearPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate.getFullYear() === currentYear;
    });

    const totalInterestPaid = thisYearPayments.reduce((sum, payment) => sum + payment.interestAmount, 0);
    const totalPrincipalPaid = thisYearPayments.reduce((sum, payment) => sum + payment.principalAmount, 0);

    // Taxa de juro média ponderada
    const totalDebtWithInterest = activeDebts.reduce((sum, debt) => sum + (debt.currentBalance * debt.interestRate), 0);
    const averageInterestRate = totalDebt > 0 ? totalDebtWithInterest / totalDebt : 0;

    // Razão dívida/renda (assumindo renda mensal de €3000 para exemplo)
    const assumedMonthlyIncome = 3000; // Isto deveria vir de outro lugar
    const debtToIncomeRatio = assumedMonthlyIncome > 0 ? (totalMonthlyPayments / assumedMonthlyIncome) * 100 : 0;

    // Projeção de quitação (simplificada)
    const calculatePayoffProjection = () => {
      if (totalDebt === 0 || totalMonthlyPayments === 0) {
        return { months: 0, totalInterest: 0, payoffDate: new Date().toISOString().split('T')[0] };
      }

      // Cálculo simplificado assumindo taxa média
      const monthlyRate = averageInterestRate / 100 / 12;
      
      if (monthlyRate === 0) {
        const months = Math.ceil(totalDebt / totalMonthlyPayments);
        return {
          months,
          totalInterest: 0,
          payoffDate: new Date(now.getFullYear(), now.getMonth() + months, now.getDate()).toISOString().split('T')[0]
        };
      }

      // Fórmula para calcular tempo de pagamento com juros compostos
      const months = Math.ceil(
        -Math.log(1 - (totalDebt * monthlyRate) / totalMonthlyPayments) / Math.log(1 + monthlyRate)
      );

      const totalPaid = totalMonthlyPayments * months;
      const totalInterest = totalPaid - totalDebt;

      const payoffDate = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());

      return {
        months: isFinite(months) ? months : 0,
        totalInterest: isFinite(totalInterest) ? totalInterest : 0,
        payoffDate: payoffDate.toISOString().split('T')[0]
      };
    };

    const payoffProjection = calculatePayoffProjection();

    // Distribuição por categoria
    const byCategory = categories.map(category => {
      const categoryDebts = activeDebts.filter(debt => debt.categoryId === category.id);
      const categoryTotalDebt = categoryDebts.reduce((sum, debt) => sum + debt.currentBalance, 0);
      const categoryMonthlyPayment = categoryDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
      const percentage = totalDebt > 0 ? (categoryTotalDebt / totalDebt) * 100 : 0;
      
      // Taxa média da categoria
      const categoryTotalWithRate = categoryDebts.reduce((sum, debt) => 
        sum + (debt.currentBalance * debt.interestRate), 0);
      const averageRate = categoryTotalDebt > 0 ? categoryTotalWithRate / categoryTotalDebt : 0;

      return {
        categoryId: category.id,
        categoryName: category.name,
        totalDebt: categoryTotalDebt,
        monthlyPayment: categoryMonthlyPayment,
        percentage,
        averageRate
      };
    }).filter(item => item.totalDebt > 0) // Apenas categorias com dívidas
      .sort((a, b) => b.totalDebt - a.totalDebt); // Ordenar por valor decrescente

    // Distribuição por prioridade
    const byPriority = {
      high: {
        count: activeDebts.filter(debt => debt.priority === 'high').length,
        totalDebt: activeDebts.filter(debt => debt.priority === 'high').reduce((sum, debt) => sum + debt.currentBalance, 0),
        monthlyPayment: activeDebts.filter(debt => debt.priority === 'high').reduce((sum, debt) => sum + debt.monthlyPayment, 0)
      },
      medium: {
        count: activeDebts.filter(debt => debt.priority === 'medium').length,
        totalDebt: activeDebts.filter(debt => debt.priority === 'medium').reduce((sum, debt) => sum + debt.currentBalance, 0),
        monthlyPayment: activeDebts.filter(debt => debt.priority === 'medium').reduce((sum, debt) => sum + debt.monthlyPayment, 0)
      },
      low: {
        count: activeDebts.filter(debt => debt.priority === 'low').length,
        totalDebt: activeDebts.filter(debt => debt.priority === 'low').reduce((sum, debt) => sum + debt.currentBalance, 0),
        monthlyPayment: activeDebts.filter(debt => debt.priority === 'low').reduce((sum, debt) => sum + debt.monthlyPayment, 0)
      }
    };

    // Data estimada para ficar livre de dívidas
    const debtFreeDate = payoffProjection.payoffDate;

    return {
      totalDebt,
      totalMonthlyPayments,
      totalInterestPaid,
      totalPrincipalPaid,
      averageInterestRate,
      debtToIncomeRatio,
      payoffProjection,
      byCategory,
      byPriority,
      debtFreeDate
    };
  }, [debts, categories, payments]);

  const recalculate = () => {
    // Esta função força um recálculo - pode ser útil para atualizações manuais
    // O useMemo já recalcula automaticamente quando debts, categories ou payments mudam
  };

  return {
    stats,
    recalculate
  };
};