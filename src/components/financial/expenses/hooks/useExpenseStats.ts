// src/hooks/useExpenseStats.ts

import { useMemo } from 'react';
import { ExpenseCategory, ExpenseEntry, ExpenseStats, UseExpenseStatsReturn } from '../../../../types/expenses';


export const useExpenseStats = (
  entries: ExpenseEntry[], 
  categories: ExpenseCategory[]
): UseExpenseStatsReturn => {
  
  const stats = useMemo((): ExpenseStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtros de período
    const thisMonthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    const lastMonthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return entryDate.getMonth() === lastMonth && entryDate.getFullYear() === lastMonthYear;
    });

    const thisYearEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === currentYear;
    });

    const lastYearEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === currentYear - 1;
    });

    // Cálculos totais
    const totalThisMonth = thisMonthEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalLastMonth = lastMonthEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalThisYear = thisYearEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalLastYear = lastYearEntries.reduce((sum, entry) => sum + entry.amount, 0);

    // Cálculos de crescimento
    const monthlyGrowth = totalLastMonth > 0 
      ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 
      : totalThisMonth > 0 ? 100 : 0;

    const yearlyGrowth = totalLastYear > 0 
      ? ((totalThisYear - totalLastYear) / totalLastYear) * 100 
      : totalThisYear > 0 ? 100 : 0;

    // Média mensal (baseada no ano atual)
    const monthsElapsed = currentMonth + 1; // Janeiro = 1, Dezembro = 12
    const averageMonthly = monthsElapsed > 0 ? totalThisYear / monthsElapsed : 0;

    // Distribuição por categoria
    const byCategory = categories.map(category => {
      const categoryEntries = thisYearEntries.filter(entry => entry.categoryId === category.id);
      const categoryTotal = categoryEntries.reduce((sum, entry) => sum + entry.amount, 0);
      const percentage = totalThisYear > 0 ? (categoryTotal / totalThisYear) * 100 : 0;
      
      // Cálculo do uso do orçamento
      const budgetUsage = category.budgetLimit 
        ? (categoryTotal / (category.budgetLimit * 12)) * 100 // Orçamento anual
        : undefined;

      return {
        categoryId: category.id,
        categoryName: category.name,
        total: categoryTotal,
        percentage,
        budgetUsage
      };
    }).filter(item => item.total > 0) // Apenas categorias com gastos
      .sort((a, b) => b.total - a.total); // Ordenar por valor decrescente

    // Status do orçamento
    const totalBudget = categories.reduce((sum, cat) => sum + (cat.budgetLimit || 0), 0) * 12; // Orçamento anual
    const budgetStatus = {
      totalBudget,
      totalSpent: totalThisYear,
      remaining: totalBudget - totalThisYear,
      percentageUsed: totalBudget > 0 ? (totalThisYear / totalBudget) * 100 : 0
    };

    // Análise essencial vs não essencial
    const essentialEntries = thisYearEntries.filter(entry => entry.isEssential);
    const nonEssentialEntries = thisYearEntries.filter(entry => !entry.isEssential);
    
    const essentialTotal = essentialEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const nonEssentialTotal = nonEssentialEntries.reduce((sum, entry) => sum + entry.amount, 0);
    
    const essentialVsNonEssential = {
      essential: essentialTotal,
      nonEssential: nonEssentialTotal,
      essentialPercentage: totalThisYear > 0 ? (essentialTotal / totalThisYear) * 100 : 0
    };

    return {
      totalThisMonth,
      totalLastMonth,
      totalThisYear,
      totalLastYear,
      averageMonthly,
      growth: {
        monthly: monthlyGrowth,
        yearly: yearlyGrowth
      },
      byCategory,
      budgetStatus,
      essentialVsNonEssential
    };
  }, [entries, categories]);

  const recalculate = () => {
    // Esta função força um recálculo - pode ser útil para atualizações manuais
    // O useMemo já recalcula automaticamente quando entries ou categories mudam
  };

  return {
    stats,
    recalculate
  };
};