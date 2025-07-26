// src/hooks/useIncomeStats.ts

import { useMemo } from 'react';
import { IncomeEntry, IncomeSource, IncomeStats, UseIncomeStatsReturn } from '../../../../types/income';


export const useIncomeStats = (
  entries: IncomeEntry[], 
  sources: IncomeSource[]
): UseIncomeStatsReturn => {
  
  const stats = useMemo((): IncomeStats => {
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

    // Distribuição por fonte
    const bySource = sources.map(source => {
      const sourceEntries = thisYearEntries.filter(entry => entry.sourceId === source.id);
      const sourceTotal = sourceEntries.reduce((sum, entry) => sum + entry.amount, 0);
      const percentage = totalThisYear > 0 ? (sourceTotal / totalThisYear) * 100 : 0;

      return {
        sourceId: source.id,
        sourceName: source.name,
        total: sourceTotal,
        percentage
      };
    }).filter(item => item.total > 0) // Apenas fontes com valores
      .sort((a, b) => b.total - a.total); // Ordenar por valor decrescente

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
      bySource
    };
  }, [entries, sources]);

  const recalculate = () => {
    // Esta função força um recálculo - pode ser útil para atualizações manuais
    // O useMemo já recalcula automaticamente quando entries ou sources mudam
  };

  return {
    stats,
    recalculate
  };
};