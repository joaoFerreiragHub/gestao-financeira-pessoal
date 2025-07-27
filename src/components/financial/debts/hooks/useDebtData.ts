// src/components/financial/debts/hooks/useDebtData.ts

import { useState, useEffect } from 'react';
import { 
  DebtCategory, 
  DebtEntry, 
  DebtPayment,
  UseDebtDataReturn, 
  DEFAULT_DEBT_CATEGORIES 
} from '../../../../types/debts';

const STORAGE_KEYS = {
  CATEGORIES: 'debt-categories',
  DEBTS: 'debt-entries',
  PAYMENTS: 'debt-payments'
} as const;

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Dados iniciais de exemplo
const getInitialCategories = (): DebtCategory[] => [
  {
    id: '1',
    name: 'Cartão de Crédito',
    icon: '💳',
    color: 'red',
    description: 'Cartões de crédito e débito em conta',
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '2',
    name: 'Empréstimo Pessoal',
    icon: '🏦',
    color: 'blue',
    description: 'Empréstimos bancários pessoais',
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '3',
    name: 'Financiamento Automóvel',
    icon: '🚗',
    color: 'orange',
    description: 'Financiamento de veículos',
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '4',
    name: 'Financiamento Imobiliário',
    icon: '🏠',
    color: 'green',
    description: 'Crédito habitação e imobiliário',
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

const getInitialDebts = (): DebtEntry[] => [
  {
    id: '1',
    categoryId: '1',
    categoryName: 'Cartão de Crédito',
    creditorName: 'Banco CTT',
    originalAmount: 2500.00,
    currentBalance: 1800.00,
    interestRate: 23.5,
    monthlyPayment: 150.00,
    minimumPayment: 45.00,
    dueDate: '2025-01-15',
    startDate: '2023-06-01',
    description: 'Cartão de crédito principal',
    isActive: true,
    priority: 'high',
    debtType: 'revolving',
    tags: ['cartao', 'prioritario'],
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '2',
    categoryId: '2',
    categoryName: 'Empréstimo Pessoal',
    creditorName: 'Millennium BCP',
    originalAmount: 15000.00,
    currentBalance: 12500.00,
    interestRate: 8.5,
    monthlyPayment: 280.00,
    dueDate: '2025-01-20',
    startDate: '2022-01-15',
    endDate: '2027-01-15',
    description: 'Empréstimo para renovação da casa',
    isActive: true,
    priority: 'medium',
    debtType: 'installment',
    tags: ['casa', 'renovacao'],
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '3',
    categoryId: '3',
    categoryName: 'Financiamento Automóvel',
    creditorName: 'Santander Consumer',
    originalAmount: 25000.00,
    currentBalance: 18700.00,
    interestRate: 6.2,
    monthlyPayment: 385.00,
    dueDate: '2025-01-10',
    startDate: '2021-03-01',
    endDate: '2026-03-01',
    description: 'Financiamento Toyota Corolla',
    isActive: true,
    priority: 'medium',
    debtType: 'installment',
    tags: ['carro', 'toyota'],
    collateral: 'Toyota Corolla 2021',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

const getInitialPayments = (): DebtPayment[] => [
  {
    id: '1',
    debtId: '1',
    amount: 150.00,
    date: '2024-12-15',
    paymentType: 'mixed',
    principalAmount: 120.00,
    interestAmount: 30.00,
    description: 'Pagamento mensal cartão',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '2',
    debtId: '2',
    amount: 280.00,
    date: '2024-12-20',
    paymentType: 'mixed',
    principalAmount: 230.00,
    interestAmount: 50.00,
    description: 'Prestação empréstimo pessoal',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

export const useDebtData = (): UseDebtDataReturn => {
  const [categories, setCategories] = useState<DebtCategory[]>([]);
  const [debts, setDebts] = useState<DebtEntry[]>([]);
  const [payments, setPayments] = useState<DebtPayment[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const savedDebts = localStorage.getItem(STORAGE_KEYS.DEBTS);
      const savedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);

      if (savedCategories && savedDebts && savedPayments) {
        setCategories(JSON.parse(savedCategories));
        setDebts(JSON.parse(savedDebts));
        setPayments(JSON.parse(savedPayments));
      } else {
        // Primeira vez - usar dados de exemplo
        const initialCategories = getInitialCategories();
        const initialDebts = getInitialDebts();
        const initialPayments = getInitialPayments();
        setCategories(initialCategories);
        setDebts(initialDebts);
        setPayments(initialPayments);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      // Fallback para dados iniciais
      setCategories(getInitialCategories());
      setDebts(getInitialDebts());
      setPayments(getInitialPayments());
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
        localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
      } catch (error) {
        console.error('Erro ao salvar dívidas no localStorage:', error);
      }
    }
  }, [debts, loading]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
      } catch (error) {
        console.error('Erro ao salvar pagamentos no localStorage:', error);
      }
    }
  }, [payments, loading]);

  // Funções de gestão de categorias
  const addCategory = (categoryData: Omit<DebtCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: DebtCategory = {
      ...categoryData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<DebtCategory>) => {
    setCategories(prev => prev.map(category => 
      category.id === id 
        ? { ...category, ...updates, updatedAt: getCurrentTimestamp() }
        : category
    ));

    // Atualizar categoryName nas dívidas se o nome mudou
    if (updates.name) {
      setDebts(prev => prev.map(debt =>
        debt.categoryId === id
          ? { ...debt, categoryName: updates.name!, updatedAt: getCurrentTimestamp() }
          : debt
      ));
    }
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    // Remover também todas as dívidas desta categoria
    setDebts(prev => prev.filter(debt => debt.categoryId !== id));
    // Remover pagamentos das dívidas removidas
    const debtIds = debts.filter(debt => debt.categoryId === id).map(debt => debt.id);
    setPayments(prev => prev.filter(payment => !debtIds.includes(payment.debtId)));
  };

  // Funções de gestão de dívidas
  const addDebt = (debtData: Omit<DebtEntry, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>) => {
    const category = categories.find(c => c.id === debtData.categoryId);
    if (!category) {
      console.error('Categoria não encontrada:', debtData.categoryId);
      return;
    }

    const newDebt: DebtEntry = {
      ...debtData,
      id: generateId(),
      categoryName: category.name,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setDebts(prev => [...prev, newDebt]);
  };

  const updateDebt = (id: string, updates: Partial<DebtEntry>) => {
    setDebts(prev => prev.map(debt => {
      if (debt.id === id) {
        const updatedDebt = { ...debt, ...updates, updatedAt: getCurrentTimestamp() };
        
        // Se mudou a categoria, atualizar o categoryName
        if (updates.categoryId && updates.categoryId !== debt.categoryId) {
          const newCategory = categories.find(c => c.id === updates.categoryId);
          if (newCategory) {
            updatedDebt.categoryName = newCategory.name;
          }
        }
        
        return updatedDebt;
      }
      return debt;
    }));
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
    // Remover também todos os pagamentos desta dívida
    setPayments(prev => prev.filter(payment => payment.debtId !== id));
  };

  // Funções de gestão de pagamentos
  const addPayment = (paymentData: Omit<DebtPayment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPayment: DebtPayment = {
      ...paymentData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setPayments(prev => [...prev, newPayment]);

    // Atualizar saldo atual da dívida
    setDebts(prev => prev.map(debt => 
      debt.id === paymentData.debtId
        ? { 
            ...debt, 
            currentBalance: Math.max(0, debt.currentBalance - paymentData.principalAmount),
            updatedAt: getCurrentTimestamp()
          }
        : debt
    ));
  };

  const updatePayment = (id: string, updates: Partial<DebtPayment>) => {
    const currentPayment = payments.find(p => p.id === id);
    if (!currentPayment) return;

    setPayments(prev => prev.map(payment => 
      payment.id === id 
        ? { ...payment, ...updates, updatedAt: getCurrentTimestamp() }
        : payment
    ));

    // Recalcular saldo se mudou o valor principal
    if (updates.principalAmount !== undefined) {
      const difference = updates.principalAmount - currentPayment.principalAmount;
      setDebts(prev => prev.map(debt => 
        debt.id === currentPayment.debtId
          ? { 
              ...debt, 
              currentBalance: Math.max(0, debt.currentBalance - difference),
              updatedAt: getCurrentTimestamp()
            }
          : debt
      ));
    }
  };

  const deletePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      // Reverter o valor principal no saldo da dívida
      setDebts(prev => prev.map(debt => 
        debt.id === payment.debtId
          ? { 
              ...debt, 
              currentBalance: debt.currentBalance + payment.principalAmount,
              updatedAt: getCurrentTimestamp()
            }
          : debt
      ));
    }
    setPayments(prev => prev.filter(payment => payment.id !== id));
  };

  // Funções utilitárias
  const clearAllData = () => {
    setCategories([]);
    setDebts([]);
    setPayments([]);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.DEBTS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  };

  const exportData = (): string => {
    const data = {
      categories,
      debts,
      payments,
      exportDate: getCurrentTimestamp(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // Validação básica
      if (!data.categories || !data.debts || !data.payments || 
          !Array.isArray(data.categories) || !Array.isArray(data.debts) || !Array.isArray(data.payments)) {
        throw new Error('Formato de dados inválido');
      }

      setCategories(data.categories);
      setDebts(data.debts);
      setPayments(data.payments);
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  };

  return {
    categories,
    debts,
    payments,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addDebt,
    updateDebt,
    deleteDebt,
    addPayment,
    updatePayment,
    deletePayment,
    clearAllData,
    exportData,
    importData
  };
};