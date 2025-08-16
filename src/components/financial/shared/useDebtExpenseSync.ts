// src/components/financial/shared/hooks/useDebtExpenseSync.ts
import { useState, useEffect, useCallback } from 'react';

interface Debt {
  id: string;
  name: string;
  monthlyPayment: number;
  type: string;
}

interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string;
  isRecurring: boolean;
  debtId?: string;
}

interface DebtExpenseSync {
  debtId: string;
  expenseId: string;
  amount: number;
  isAutomatic: boolean;
  syncedAt: string;
}

interface UseDebtExpenseSyncReturn {
  syncData: DebtExpenseSync[];
  syncDebtWithExpense: (debtId: string, expenseId: string) => void;
  createExpenseFromDebt: (debt: Debt) => ExpenseEntry;
  unsyncDebt: (debtId: string) => void;
  isSynced: (debtId: string) => boolean;
  getSyncedExpense: (debtId: string) => ExpenseEntry | null;
}

const STORAGE_KEY = 'debt-expense-sync';

export const useDebtExpenseSync = (
  debts: Debt[] = [],
  expenses: ExpenseEntry[] = [],
  onExpenseCreate?: (expense: Omit<ExpenseEntry, 'id'>) => void,
  onExpenseUpdate?: (id: string, updates: Partial<ExpenseEntry>) => void
): UseDebtExpenseSyncReturn => {
  const [syncData, setSyncData] = useState<DebtExpenseSync[]>([]);

  // Load sync data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSyncData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading sync data:', error);
      }
    }
  }, []);

  // Save sync data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(syncData));
  }, [syncData]);

  const syncDebtWithExpense = useCallback((debtId: string, expenseId: string) => {
    const debt = debts.find(d => d.id === debtId);
    const expense = expenses.find(e => e.id === expenseId);
    
    if (!debt || !expense) return;

    const newSync: DebtExpenseSync = {
      debtId,
      expenseId,
      amount: expense.amount,
      isAutomatic: false,
      syncedAt: new Date().toISOString()
    };

    setSyncData(prev => {
      // Remove existing sync for this debt
      const filtered = prev.filter(sync => sync.debtId !== debtId);
      return [...filtered, newSync];
    });

    // Update expense to link to debt
    if (onExpenseUpdate) {
      onExpenseUpdate(expenseId, { debtId });
    }
  }, [debts, expenses, onExpenseUpdate]);

  const createExpenseFromDebt = useCallback((debt: Debt): ExpenseEntry => {
    const newExpense: ExpenseEntry = {
      id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: `Pagamento ${debt.name}`,
      amount: debt.monthlyPayment,
      categoryId: 'debts', // Assuming there's a debts category
      date: new Date().toISOString().split('T')[0],
      isRecurring: true,
      debtId: debt.id
    };

    // Create the expense
    if (onExpenseCreate) {
      onExpenseCreate(newExpense);
    }

    // Create automatic sync
    const newSync: DebtExpenseSync = {
      debtId: debt.id,
      expenseId: newExpense.id,
      amount: debt.monthlyPayment,
      isAutomatic: true,
      syncedAt: new Date().toISOString()
    };

    setSyncData(prev => {
      const filtered = prev.filter(sync => sync.debtId !== debt.id);
      return [...filtered, newSync];
    });

    return newExpense;
  }, [onExpenseCreate]);

  const unsyncDebt = useCallback((debtId: string) => {
    const sync = syncData.find(s => s.debtId === debtId);
    
    if (sync && onExpenseUpdate) {
      // Remove debt reference from expense
      onExpenseUpdate(sync.expenseId, { debtId: undefined });
    }

    setSyncData(prev => prev.filter(sync => sync.debtId !== debtId));
  }, [syncData, onExpenseUpdate]);

  const isSynced = useCallback((debtId: string): boolean => {
    return syncData.some(sync => sync.debtId === debtId);
  }, [syncData]);

  const getSyncedExpense = useCallback((debtId: string): ExpenseEntry | null => {
    const sync = syncData.find(s => s.debtId === debtId);
    if (!sync) return null;
    
    return expenses.find(expense => expense.id === sync.expenseId) || null;
  }, [syncData, expenses]);

  // Auto-sync new debts if they have matching expenses
  useEffect(() => {
    debts.forEach(debt => {
      if (!isSynced(debt.id)) {
        // Look for expenses that might match this debt
        const matchingExpense = expenses.find(expense => 
          expense.description.toLowerCase().includes(debt.name.toLowerCase()) &&
          Math.abs(expense.amount - debt.monthlyPayment) < 0.01
        );

        if (matchingExpense) {
          syncDebtWithExpense(debt.id, matchingExpense.id);
        }
      }
    });
  }, [debts, expenses, isSynced, syncDebtWithExpense]);

  return {
    syncData,
    syncDebtWithExpense,
    createExpenseFromDebt,
    unsyncDebt,
    isSynced,
    getSyncedExpense
  };
};