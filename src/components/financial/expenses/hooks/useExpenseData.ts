// src/hooks/useExpenseData.ts

import { useState, useEffect } from 'react';
import { ExpenseCategory, ExpenseEntry, UseExpenseDataReturn } from '../../../../types/expenses';

const STORAGE_KEYS = {
  CATEGORIES: 'expense-categories',
  ENTRIES: 'expense-entries'
} as const;

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Dados iniciais de exemplo
const getInitialCategories = (): ExpenseCategory[] => [
  {
    id: '1',
    name: 'Alimentação',
    icon: '🍽️',
    color: 'orange',
    budgetLimit: 600,
    description: 'Supermercado, restaurantes, delivery',
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '2',
    name: 'Transporte',
    icon: '🚗',
    color: 'blue',
    budgetLimit: 300,
    description: 'Combustível, transportes públicos, manutenção',
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '3',
    name: 'Habitação',
    icon: '🏠',
    color: 'green',
    budgetLimit: 800,
    description: 'Renda, condomínio, utilidades',
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '4',
    name: 'Entretenimento',
    icon: '🎬',
    color: 'pink',
    budgetLimit: 200,
    description: 'Cinema, streaming, jogos, saídas',
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

const getInitialEntries = (): ExpenseEntry[] => [
  {
    id: '1',
    categoryId: '1',
    categoryName: 'Alimentação',
    amount: 85.50,
    date: '2024-12-20',
    description: 'Supermercado Continente',
    isRecurring: false,
    tags: ['supermercado', 'essencial'],
    paymentMethod: 'card',
    isEssential: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '2',
    categoryId: '2',
    categoryName: 'Transporte',
    amount: 45.00,
    date: '2024-12-18',
    description: 'Combustível',
    isRecurring: false,
    tags: ['gasolina', 'essencial'],
    paymentMethod: 'card',
    isEssential: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '3',
    categoryId: '4',
    categoryName: 'Entretenimento',
    amount: 12.99,
    date: '2024-12-15',
    description: 'Netflix',
    isRecurring: true,
    frequency: 'monthly',
    tags: ['streaming', 'subscricao'],
    paymentMethod: 'card',
    isEssential: false,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '4',
    categoryId: '1',
    categoryName: 'Alimentação',
    amount: 32.50,
    date: '2024-12-14',
    description: 'Jantar restaurante',
    isRecurring: false,
    tags: ['restaurante', 'social'],
    paymentMethod: 'card',
    isEssential: false,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '5',
    categoryId: '3',
    categoryName: 'Habitação',
    amount: 750.00,
    date: '2024-12-01',
    description: 'Renda do apartamento',
    isRecurring: true,
    frequency: 'monthly',
    tags: ['renda', 'essencial'],
    paymentMethod: 'transfer',
    isEssential: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

export const useExpenseData = (): UseExpenseDataReturn => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);

      if (savedCategories && savedEntries) {
        setCategories(JSON.parse(savedCategories));
        setEntries(JSON.parse(savedEntries));
      } else {
        // Primeira vez - usar dados de exemplo
        const initialCategories = getInitialCategories();
        const initialEntries = getInitialEntries();
        setCategories(initialCategories);
        setEntries(initialEntries);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      // Fallback para dados iniciais
      setCategories(getInitialCategories());
      setEntries(getInitialEntries());
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar dados automaticamente quando mudam
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      } catch (error) {
        console.error('Erro ao salvar categorias no localStorage:', error);
      }
    }
  }, [categories, loading]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
      } catch (error) {
        console.error('Erro ao salvar entradas no localStorage:', error);
      }
    }
  }, [entries, loading]);

  // Funções de gestão de categorias
  const addCategory = (categoryData: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: ExpenseCategory = {
      ...categoryData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<ExpenseCategory>) => {
    setCategories(prev => prev.map(category => 
      category.id === id 
        ? { ...category, ...updates, updatedAt: getCurrentTimestamp() }
        : category
    ));

    // Atualizar categoryName nas entradas se o nome mudou
    if (updates.name) {
      setEntries(prev => prev.map(entry =>
        entry.categoryId === id
          ? { ...entry, categoryName: updates.name!, updatedAt: getCurrentTimestamp() }
          : entry
      ));
    }
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    // Remover também todas as entradas desta categoria
    setEntries(prev => prev.filter(entry => entry.categoryId !== id));
  };

  // Funções de gestão de entradas
  const addEntry = (entryData: Omit<ExpenseEntry, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>) => {
    const category = categories.find(c => c.id === entryData.categoryId);
    if (!category) {
      console.error('Categoria não encontrada:', entryData.categoryId);
      return;
    }

    const newEntry: ExpenseEntry = {
      ...entryData,
      id: generateId(),
      categoryName: category.name,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const updateEntry = (id: string, updates: Partial<ExpenseEntry>) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, ...updates, updatedAt: getCurrentTimestamp() };
        
        // Se mudou a categoria, atualizar o categoryName
        if (updates.categoryId && updates.categoryId !== entry.categoryId) {
          const newCategory = categories.find(c => c.id === updates.categoryId);
          if (newCategory) {
            updatedEntry.categoryName = newCategory.name;
          }
        }
        
        return updatedEntry;
      }
      return entry;
    }));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Funções utilitárias
  const clearAllData = () => {
    setCategories([]);
    setEntries([]);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
  };

  const exportData = (): string => {
    const data = {
      categories,
      entries,
      exportDate: getCurrentTimestamp(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // Validação básica
      if (!data.categories || !data.entries || !Array.isArray(data.categories) || !Array.isArray(data.entries)) {
        throw new Error('Formato de dados inválido');
      }

      setCategories(data.categories);
      setEntries(data.entries);
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  };

  return {
    categories,
    entries,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addEntry,
    updateEntry,
    deleteEntry,
    clearAllData,
    exportData,
    importData
  };
};