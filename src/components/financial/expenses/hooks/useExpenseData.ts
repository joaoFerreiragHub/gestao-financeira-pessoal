// src/components/financial/expenses/hooks/useExpenseData.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  ExpenseCategory, 
  ExpenseEntry, 
  ExpenseStats, 
  UseExpenseDataReturn,
  DEFAULT_EXPENSE_CATEGORIES 
} from '../../../types/financial/expenses';

const STORAGE_KEYS = {
  CATEGORIES: 'expense-categories',
  ENTRIES: 'expense-entries'
};

export const useExpenseData = (): UseExpenseDataReturn => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    try {
      setIsLoading(true);
      
      // Load categories
      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        // Initialize with default categories
        const defaultCategories: ExpenseCategory[] = DEFAULT_EXPENSE_CATEGORIES.map((cat, index) => ({
          ...cat,
          id: `cat-${index + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        setCategories(defaultCategories);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
      }

      // Load entries
      const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }

      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados das despesas');
      console.error('Error loading expense data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save categories to localStorage
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
  }, [categories]);

  // Save entries to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    }
  }, [entries]);

  // Category management
  const addCategory = useCallback((categoryData: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: ExpenseCategory = {
      ...categoryData,
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCategories(prev => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<ExpenseCategory>) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, ...updates, updatedAt: new Date().toISOString() }
          : category
      )
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    // Don't allow deletion if there are entries in this category
    const hasEntries = entries.some(entry => entry.categoryId === id);
    if (hasEntries) {
      setError('Não é possível eliminar uma categoria que tem despesas associadas');
      return;
    }

    setCategories(prev => prev.filter(category => category.id !== id));
  }, [entries]);

  // Entry management
  const addEntry = useCallback((entryData: Omit<ExpenseEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const category = categories.find(cat => cat.id === entryData.categoryId);
    const newEntry: ExpenseEntry = {
      ...entryData,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      categoryName: category?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEntries(prev => [...prev, newEntry]);
  }, [categories]);

  const updateEntry = useCallback((id: string, updates: Partial<ExpenseEntry>) => {
    setEntries(prev => 
      prev.map(entry => {
        if (entry.id === id) {
          const updatedEntry = { ...entry, ...updates, updatedAt: new Date().toISOString() };
          
          // Update category name if categoryId changed
          if (updates.categoryId) {
            const category = categories.find(cat => cat.id === updates.categoryId);
            updatedEntry.categoryName = category?.name || entry.categoryName;
          }
          
          return updatedEntry;
        }
        return entry;
      })
    );
  }, [categories]);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  // Utility functions
  const getCategoryExpenses = useCallback((categoryId: string) => {
    return entries.filter(entry => entry.categoryId === categoryId);
  }, [entries]);

  const getFixedExpenses = useCallback(() => {
    return entries.filter(entry => entry.type === 'fixed');
  }, [entries]);

  const getVariableExpenses = useCallback(() => {
    return entries.filter(entry => entry.type === 'variable');
  }, [entries]);

  const getDebtExpenses = useCallback(() => {
    return entries.filter(entry => entry.debtId);
  }, [entries]);

  // Calculate statistics
  const stats: ExpenseStats = {
    totalExpenses: entries.reduce((sum, entry) => sum + entry.amount, 0),
    fixedExpenses: getFixedExpenses().reduce((sum, entry) => sum + entry.amount, 0),
    variableExpenses: getVariableExpenses().reduce((sum, entry) => sum + entry.amount, 0),
    debtPayments: getDebtExpenses().reduce((sum, entry) => sum + entry.amount, 0),
    averageMonthly: 0, // This would need historical data
    categoryBreakdown: categories.map(category => {
      const categoryEntries = getCategoryExpenses(category.id);
      const amount = categoryEntries.reduce((sum, entry) => sum + entry.amount, 0);
      const totalExpenses = entries.reduce((sum, entry) => sum + entry.amount, 0);
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      };
    }),
    monthlyTrend: [], // This would need historical data
    budgetVsActual: categories.map(category => {
      const categoryEntries = getCategoryExpenses(category.id);
      const actual = categoryEntries.reduce((sum, entry) => sum + entry.amount, 0);
      
      return {
        categoryId: category.name,
        budgeted: category.budget,
        actual,
        variance: actual - category.budget
      };
    })
  };

  // Data export/import
  const exportData = useCallback(() => {
    const exportData = {
      categories,
      entries,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(exportData, null, 2);
  }, [categories, entries]);

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
      
      if (data.entries && Array.isArray(data.entries)) {
        setEntries(data.entries);
      }
      
      return true;
    } catch (err) {
      setError('Erro ao importar dados');
      return false;
    }
  }, []);

  const clearAllData = useCallback(() => {
    setCategories([]);
    setEntries([]);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
  }, []);

  return {
    categories,
    entries,
    stats,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addEntry,
    updateEntry,
    deleteEntry,
    getCategoryExpenses,
    getFixedExpenses,
    getVariableExpenses,
    getDebtExpenses,
    exportData,
    importData,
    clearAllData
  };
};