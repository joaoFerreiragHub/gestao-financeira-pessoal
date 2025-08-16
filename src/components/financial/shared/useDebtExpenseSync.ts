import { useState, useEffect, useCallback } from 'react';

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  monthlyPayment: number;
  interestRate: number;
  remainingMonths: number;
  category: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  debtName: string;
  amount: number;
  date: string;
  description?: string;
  isAutomatic: boolean;
  expenseId?: string; // ID da despesa correspondente
}

export interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string;
  isRecurring?: boolean;
  debtId?: string; // Ligação à dívida
}

interface UseDebtExpenseSyncReturn {
  debts: Debt[];
  debtPayments: DebtPayment[];
  expenses: ExpenseEntry[];
  addDebtPayment: (payment: Omit<DebtPayment, 'id'>) => void;
  updateDebtPayment: (id: string, payment: Partial<DebtPayment>) => void;
  deleteDebtPayment: (id: string) => void;
  syncDebtWithExpense: (debtId: string, expenseId: string) => void;
  getDebtExpenses: (debtId: string) => ExpenseEntry[];
  getTotalPaidForDebt: (debtId: string) => number;
  isDebtPaymentSynced: (paymentId: string) => boolean;
}

const STORAGE_KEYS = {
  DEBTS: 'financial-debts',
  DEBT_PAYMENTS: 'debt-payments',
  EXPENSES: 'financial-expenses'
} as const;

// Mock data inicial
const getMockDebts = (): Debt[] => [
  {
    id: 'debt1',
    name: 'Crédito Habitação',
    totalAmount: 85000,
    monthlyPayment: 420,
    interestRate: 3.5,
    remainingMonths: 180,
    category: 'mortgage'
  },
  {
    id: 'debt2',
    name: 'Cartão de Crédito',
    totalAmount: 2500,
    monthlyPayment: 150,
    interestRate: 18.9,
    remainingMonths: 20,
    category: 'credit_card'
  },
  {
    id: 'debt3',
    name: 'Empréstimo Automóvel',
    totalAmount: 12000,
    monthlyPayment: 280,
    interestRate: 6.2,
    remainingMonths: 48,
    category: 'auto_loan'
  }
];

const getMockDebtPayments = (): DebtPayment[] => [
  {
    id: 'payment1',
    debtId: 'debt1',
    debtName: 'Crédito Habitação',
    amount: 420,
    date: '2024-01-15',
    description: 'Pagamento mensal janeiro',
    isAutomatic: true,
    expenseId: 'expense1'
  },
  {
    id: 'payment2',
    debtId: 'debt2',
    debtName: 'Cartão de Crédito',
    amount: 150,
    date: '2024-01-10',
    description: 'Pagamento mínimo janeiro',
    isAutomatic: false,
    expenseId: 'expense2'
  }
];

const getMockExpenses = (): ExpenseEntry[] => [
  {
    id: 'expense1',
    description: 'Pagamento Crédito Habitação',
    amount: 420,
    categoryId: 'debts',
    date: '2024-01-15',
    isRecurring: true,
    debtId: 'debt1'
  },
  {
    id: 'expense2',
    description: 'Pagamento Cartão de Crédito',
    amount: 150,
    categoryId: 'debts',
    date: '2024-01-10',
    debtId: 'debt2'
  }
];

export const useDebtExpenseSync = (): UseDebtExpenseSyncReturn => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    const savedDebts = localStorage.getItem(STORAGE_KEYS.DEBTS);
    const savedPayments = localStorage.getItem(STORAGE_KEYS.DEBT_PAYMENTS);
    const savedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);

    if (savedDebts && savedPayments && savedExpenses) {
      setDebts(JSON.parse(savedDebts));
      setDebtPayments(JSON.parse(savedPayments));
      setExpenses(JSON.parse(savedExpenses));
    } else {
      // Primeira vez - usar dados mock
      const initialDebts = getMockDebts();
      const initialPayments = getMockDebtPayments();
      const initialExpenses = getMockExpenses();
      
      setDebts(initialDebts);
      setDebtPayments(initialPayments);
      setExpenses(initialExpenses);
      
      // Salvar no localStorage
      localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(initialDebts));
      localStorage.setItem(STORAGE_KEYS.DEBT_PAYMENTS, JSON.stringify(initialPayments));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(initialExpenses));
    }
  }, []);

  // Salvar mudanças no localStorage
  useEffect(() => {
    if (debts.length > 0) {
      localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
    }
  }, [debts]);

  useEffect(() => {
    if (debtPayments.length > 0) {
      localStorage.setItem(STORAGE_KEYS.DEBT_PAYMENTS, JSON.stringify(debtPayments));
    }
  }, [debtPayments]);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    }
  }, [expenses]);

  // Adicionar pagamento de dívida
  const addDebtPayment = useCallback((payment: Omit<DebtPayment, 'id'>) => {
    const newPayment: DebtPayment = {
      ...payment,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    setDebtPayments(prev => [...prev, newPayment]);

    // Criar despesa correspondente automaticamente
    const correspondingExpense: ExpenseEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      description: `Pagamento ${payment.debtName}`,
      amount: payment.amount,
      categoryId: 'debts',
      date: payment.date,
      isRecurring: payment.isAutomatic,
      debtId: payment.debtId
    };

    setExpenses(prev => [...prev, correspondingExpense]);

    // Atualizar o pagamento com a referência da despesa
    newPayment.expenseId = correspondingExpense.id;
    setDebtPayments(prev => 
      prev.map(p => p.id === newPayment.id ? newPayment : p)
    );
  }, []);

  // Atualizar pagamento de dívida
  const updateDebtPayment = useCallback((id: string, updates: Partial<DebtPayment>) => {
    setDebtPayments(prev => 
      prev.map(payment => 
        payment.id === id ? { ...payment, ...updates } : payment
      )
    );

    // Se houver despesa correspondente, atualizar também
    const payment = debtPayments.find(p => p.id === id);
    if (payment?.expenseId && updates.amount) {
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === payment.expenseId 
            ? { ...expense, amount: updates.amount! }
            : expense
        )
      );
    }
  }, [debtPayments]);

  // Deletar pagamento de dívida
  const deleteDebtPayment = useCallback((id: string) => {
    const payment = debtPayments.find(p => p.id === id);
    
    setDebtPayments(prev => prev.filter(p => p.id !== id));
    
    // Remover despesa correspondente também
    if (payment?.expenseId) {
      setExpenses(prev => prev.filter(e => e.id !== payment.expenseId));
    }
  }, [debtPayments]);

  // Sincronizar dívida com despesa existente
  const syncDebtWithExpense = useCallback((debtId: string, expenseId: string) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === expenseId 
          ? { ...expense, debtId, categoryId: 'debts' }
          : expense
      )
    );
  }, []);

  // Obter despesas de uma dívida específica
  const getDebtExpenses = useCallback((debtId: string): ExpenseEntry[] => {
    return expenses.filter(expense => expense.debtId === debtId);
  }, [expenses]);

  // Calcular total pago para uma dívida
  const getTotalPaidForDebt = useCallback((debtId: string): number => {
    const debtExpenses = getDebtExpenses(debtId);
    return debtExpenses.reduce((total, expense) => total + expense.amount, 0);
  }, [getDebtExpenses]);

  // Verificar se um pagamento está sincronizado
  const isDebtPaymentSynced = useCallback((paymentId: string): boolean => {
    const payment = debtPayments.find(p => p.id === paymentId);
    return !!payment?.expenseId;
  }, [debtPayments]);

  return {
    debts,
    debtPayments,
    expenses,
    addDebtPayment,
    updateDebtPayment,
    deleteDebtPayment,
    syncDebtWithExpense,
    getDebtExpenses,
    getTotalPaidForDebt,
    isDebtPaymentSynced
  };
};