// src/components/financial/debts/DebtPaymentManager.tsx

import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, DollarSign, Calendar, TrendingDown, TrendingUp, Target, Filter, X, AlertCircle } from 'lucide-react';
import { DebtEntry, DebtPayment, DebtPaymentFormData } from '../../../types/debts';

interface DebtPaymentManagerProps {
  debts: DebtEntry[];
  payments: DebtPayment[];
  showBalances: boolean;
  onAddPayment: (payment: Omit<DebtPayment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditPayment: (paymentId: string, updates: Partial<DebtPayment>) => void;
  onDeletePayment: (paymentId: string) => void;
  formatCurrency: (amount: number) => string;
}

interface PaymentFormProps {
  debts: DebtEntry[];
  payment?: DebtPayment | null;
  onSubmit: (data: DebtPaymentFormData) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  debts,
  payment,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<DebtPaymentFormData>({
    debtId: payment?.debtId || '',
    amount: payment?.amount.toString() || '',
    date: payment?.date || new Date().toISOString().split('T')[0],
    paymentType: payment?.paymentType || 'mixed',
    description: payment?.description || '',
  });

  const [errors, setErrors] = useState<Partial<DebtPaymentFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<DebtPaymentFormData> = {};

    if (!formData.debtId) {
      newErrors.debtId = 'Selecione uma dívida';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    // Validar se a data não é futura
    const paymentDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Permitir até o fim do dia atual

    if (paymentDate > today) {
      newErrors.date = 'Data não pode ser futura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof DebtPaymentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const selectedDebt = debts.find(d => d.id === formData.debtId);

  // Helper para formatar valores opcionais
  const formatOptionalValue = (value: number | undefined) => {
    return value !== undefined ? value.toFixed(2) : 'N/A';
  };

  const getPaymentTypeDescription = (type: string) => {
    switch (type) {
      case 'mixed':
        return 'Pagamento normal incluindo principal e juros';
      case 'interest':
        return 'Pagamento apenas de juros acumulados';
      case 'principal':
        return 'Pagamento direto ao principal (sem juros)';
      case 'extra':
        return 'Pagamento adicional além do normal';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {payment ? 'Editar Pagamento' : 'Novo Pagamento'}
              </h3>
              <p className="text-sm text-gray-600">
                {payment ? 'Atualize os dados do pagamento' : 'Registe um novo pagamento de dívida'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Seleção de Dívida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dívida *
            </label>
            <select
              name="debtId"
              value={formData.debtId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.debtId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma dívida</option>
              {debts.filter(d => d.isActive).map(debt => (
                <option key={debt.id} value={debt.id}>
                  {debt.creditorName} - {debt.categoryName}
                </option>
              ))}
            </select>
            {errors.debtId && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.debtId}
              </p>
            )}
          </div>

          {/* Informações da Dívida Selecionada */}
          {selectedDebt && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Informações da Dívida:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Saldo:</span>
                  <span className="font-medium text-red-600 ml-1">
                    €{selectedDebt.currentBalance.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Taxa:</span>
                  <span className="font-medium ml-1">{selectedDebt.interestRate}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Pagamento Mensal:</span>
                  <span className="font-medium ml-1">€{selectedDebt.monthlyPayment.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Mínimo:</span>
                  <span className="font-medium ml-1">€{formatOptionalValue(selectedDebt.minimumPayment)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Valor do Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor do Pagamento *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">€</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Data do Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data do Pagamento *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Tipo de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Pagamento
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="mixed">Misto (Principal + Juros)</option>
              <option value="interest">Apenas Juros</option>
              <option value="principal">Apenas Principal</option>
              <option value="extra">Pagamento Extra</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {getPaymentTypeDescription(formData.paymentType)}
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Notas sobre este pagamento..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Preview dos Cálculos */}
          {selectedDebt && formData.amount && parseFloat(formData.amount) > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="text-sm font-medium text-blue-800 mb-2">📊 Distribuição Prevista:</h5>
              <div className="text-xs text-blue-700">
                {(() => {
                  const amount = parseFloat(formData.amount);
                  const monthlyRate = selectedDebt.interestRate / 100 / 12;
                  const estimatedInterest = selectedDebt.currentBalance * monthlyRate;
                  
                  let principal = 0;
                  let interest = 0;
                  
                  if (formData.paymentType === 'principal') {
                    principal = amount;
                  } else if (formData.paymentType === 'interest') {
                    interest = amount;
                  } else if (formData.paymentType === 'extra') {
                    principal = amount;
                  } else { // mixed
                    interest = Math.min(amount, estimatedInterest);
                    principal = amount - interest;
                  }
                  
                  return (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-blue-600">Principal:</span>
                        <span className="font-medium ml-1">€{principal.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Juros:</span>
                        <span className="font-medium ml-1">€{interest.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {payment ? 'Atualizar' : 'Registar'} Pagamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const DebtPaymentManager: React.FC<DebtPaymentManagerProps> = ({
  debts,
  payments,
  showBalances,
  onAddPayment,
  onEditPayment,
  onDeletePayment,
  formatCurrency,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<DebtPayment | null>(null);
  const [selectedDebtFilter, setSelectedDebtFilter] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('thisMonth');

  // Filtrar pagamentos
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Filtro por dívida
      if (selectedDebtFilter !== 'all' && payment.debtId !== selectedDebtFilter) {
        return false;
      }

      // Filtro por período
      const paymentDate = new Date(payment.date);
      const now = new Date();

      switch (selectedPeriod) {
        case 'thisMonth':
          return paymentDate.getMonth() === now.getMonth() && 
                 paymentDate.getFullYear() === now.getFullYear();
        case 'lastMonth': {
          const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          return paymentDate.getMonth() === lastMonth && 
                 paymentDate.getFullYear() === lastMonthYear;
        }
        case 'last3Months': {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return paymentDate >= threeMonthsAgo;
        }
        case 'thisYear':
          return paymentDate.getFullYear() === now.getFullYear();
        case 'lastYear':
          return paymentDate.getFullYear() === now.getFullYear() - 1;
        case 'all':
        default:
          return true;
      }
    });
  }, [payments, selectedDebtFilter, selectedPeriod]);

  // Estatísticas dos pagamentos
  const paymentStats = useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPrincipal = filteredPayments.reduce((sum, p) => sum + p.principalAmount, 0);
    const totalInterest = filteredPayments.reduce((sum, p) => sum + p.interestAmount, 0);
    const averagePayment = filteredPayments.length > 0 ? totalAmount / filteredPayments.length : 0;

    // Agrupar por tipo de pagamento
    const paymentsByType = filteredPayments.reduce((acc, payment) => {
      acc[payment.paymentType] = (acc[payment.paymentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Pagamentos por mês (últimos 6 meses)
    const monthlyPayments = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthPayments = payments.filter(p => {
        const pDate = new Date(p.date);
        return pDate.getMonth() === month && pDate.getFullYear() === year;
      });
      
      return {
        month: date.toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' }),
        amount: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        count: monthPayments.length,
      };
    }).reverse();

    return {
      totalAmount,
      totalPrincipal,
      totalInterest,
      averagePayment,
      paymentCount: filteredPayments.length,
      paymentsByType,
      monthlyPayments,
    };
  }, [filteredPayments, payments]);

  const handleFormSubmit = (data: DebtPaymentFormData) => {
    const amount = parseFloat(data.amount);
    
    // Calcular principal e juros baseado no tipo de pagamento
    let principalAmount = 0;
    let interestAmount = 0;

    if (data.paymentType === 'principal') {
      principalAmount = amount;
    } else if (data.paymentType === 'interest') {
      interestAmount = amount;
    } else {
      // Para 'mixed' e 'extra', fazer uma divisão baseada na taxa de juro
      const debt = debts.find(d => d.id === data.debtId);
      if (debt && debt.interestRate > 0) {
        // Calcular juros mensais baseado no saldo atual
        const monthlyInterestRate = debt.interestRate / 100 / 12;
        const estimatedInterest = debt.currentBalance * monthlyInterestRate;
        
        if (data.paymentType === 'extra') {
          // Pagamento extra vai todo para principal
          principalAmount = amount;
        } else {
          // Pagamento misto - primeiro pagam-se os juros, resto vai para principal
          interestAmount = Math.min(amount, estimatedInterest);
          principalAmount = amount - interestAmount;
        }
      } else {
        principalAmount = amount;
      }
    }

    const paymentData = {
      debtId: data.debtId,
      amount,
      date: data.date,
      paymentType: data.paymentType,
      principalAmount,
      interestAmount,
      description: data.description,
    };

    if (editingPayment) {
      onEditPayment(editingPayment.id, paymentData);
    } else {
      onAddPayment(paymentData);
    }

    setShowForm(false);
    setEditingPayment(null);
  };

  const handleEditPayment = (payment: DebtPayment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDeletePayment = (payment: DebtPayment) => {
    const debt = debts.find(d => d.id === payment.debtId);
    const debtName = debt ? debt.creditorName : 'Dívida desconhecida';
    
    const confirmed = window.confirm(
      `Tem a certeza que quer eliminar este pagamento?\n\n` +
      `Dívida: ${debtName}\n` +
      `Valor: ${formatCurrency(payment.amount)}\n` +
      `Data: ${new Date(payment.date).toLocaleDateString('pt-PT')}\n\n` +
      `Esta ação não pode ser desfeita.`
    );
    
    if (confirmed) {
      onDeletePayment(payment.id);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header e Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestão de Pagamentos</h3>
          <p className="text-sm text-gray-600">
            Registe e acompanhe os pagamentos das suas dívidas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filtros */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="thisMonth">Este Mês</option>
              <option value="lastMonth">Mês Passado</option>
              <option value="last3Months">Últimos 3 Meses</option>
              <option value="thisYear">Este Ano</option>
              <option value="lastYear">Ano Passado</option>
              <option value="all">Todos</option>
            </select>

            <select
              value={selectedDebtFilter}
              onChange={(e) => setSelectedDebtFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas as Dívidas</option>
              {debts.filter(d => d.isActive).map(debt => (
                <option key={debt.id} value={debt.id}>
                  {debt.creditorName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Pagamento
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pago</p>
              <p className="text-xl font-bold text-blue-600">
                {showBalances ? formatCurrency(paymentStats.totalAmount) : '€•••••'}
              </p>
              <p className="text-xs text-gray-500">
                {paymentStats.paymentCount} pagamentos
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Principal Pago</p>
              <p className="text-xl font-bold text-green-600">
                {showBalances ? formatCurrency(paymentStats.totalPrincipal) : '€•••••'}
              </p>
              <p className="text-xs text-gray-500">
                {((paymentStats.totalPrincipal / paymentStats.totalAmount) * 100 || 0).toFixed(1)}% do total
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Juros Pagos</p>
              <p className="text-xl font-bold text-red-600">
                {showBalances ? formatCurrency(paymentStats.totalInterest) : '€•••••'}
              </p>
              <p className="text-xs text-gray-500">
                {((paymentStats.totalInterest / paymentStats.totalAmount) * 100 || 0).toFixed(1)}% do total
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Média por Pagamento</p>
              <p className="text-xl font-bold text-purple-600">
                {showBalances ? formatCurrency(paymentStats.averagePayment) : '€•••••'}
              </p>
              <p className="text-xs text-gray-500">
                {paymentStats.paymentCount} pagamentos
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Gráfico de Pagamentos Mensais */}
      {paymentStats.monthlyPayments.some(m => m.amount > 0) && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Pagamentos (Últimos 6 Meses)</h4>
          <div className="space-y-3">
            {paymentStats.monthlyPayments.map((month, index) => {
              const maxAmount = Math.max(...paymentStats.monthlyPayments.map(m => m.amount));
              const widthPercentage = maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">{month.month}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                    <div 
                      className="bg-blue-500 h-6 rounded-full transition-all duration-300"
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center px-2">
                      <span className="text-xs font-medium text-white">
                        {month.amount > 0 && showBalances ? formatCurrency(month.amount) : ''}
                      </span>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {month.count} pag.
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de Pagamentos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pagamento encontrado</h3>
            <p className="text-gray-600 mb-4">
              {selectedPeriod === 'thisMonth' 
                ? 'Não foram registados pagamentos este mês.'
                : 'Não há pagamentos para os filtros selecionados.'
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Registar Primeiro Pagamento
            </button>
          </div>
        ) : (
          <>
            {/* Tabela Desktop */}
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
                  {filteredPayments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((payment) => {
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
                                onClick={() => handleEditPayment(payment)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Editar pagamento"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePayment(payment)}
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

            {/* Cards Mobile */}
            <div className="lg:hidden space-y-4 p-4">
              {filteredPayments
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((payment) => {
                  const debt = getDebtInfo(payment.debtId);
                  
                  return (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getPaymentTypeIcon(payment.paymentType)}
                          <span className="font-medium text-gray-900">
                            {showBalances ? formatCurrency(payment.amount) : '€•••••'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditPayment(payment)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Data:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(payment.date).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Dívida:</span>
                          <span className="text-sm text-gray-900">
                            {debt?.creditorName || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tipo:</span>
                          <span className="text-sm text-gray-900">
                            {getPaymentTypeText(payment.paymentType)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-xs text-gray-500">Principal</span>
                            <p className="text-sm font-medium text-green-600">
                              {showBalances ? formatCurrency(payment.principalAmount) : '€•••••'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Juros</span>
                            <p className="text-sm font-medium text-red-600">
                              {showBalances ? formatCurrency(payment.interestAmount) : '€•••••'}
                            </p>
                          </div>
                        </div>
                        
                        {payment.description && (
                          <div className="pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">Descrição:</span>
                            <p className="text-sm text-gray-700">{payment.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>

      {/* Análise por Tipo de Pagamento */}
      {Object.keys(paymentStats.paymentsByType).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Análise por Tipo de Pagamento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(paymentStats.paymentsByType).map(([type, count]) => {
              const typePayments = filteredPayments.filter(p => p.paymentType === type);
              const totalAmount = typePayments.reduce((sum, p) => sum + p.amount, 0);
              const percentage = (count / paymentStats.paymentCount) * 100;
              
              return (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    {getPaymentTypeIcon(type)}
                  </div>
                  <h5 className="font-medium text-gray-900">{getPaymentTypeText(type)}</h5>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {count}
                  </p>
                  <p className="text-sm text-gray-600">
                    {percentage.toFixed(1)}% dos pagamentos
                  </p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    {showBalances ? formatCurrency(totalAmount) : '€•••••'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumo por Dívida */}
      {filteredPayments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Dívida</h4>
          <div className="space-y-3">
            {debts
              .filter(debt => filteredPayments.some(p => p.debtId === debt.id))
              .map(debt => {
                const debtPayments = filteredPayments.filter(p => p.debtId === debt.id);
                const totalPaid = debtPayments.reduce((sum, p) => sum + p.amount, 0);
                const totalPrincipal = debtPayments.reduce((sum, p) => sum + p.principalAmount, 0);
                const totalInterest = debtPayments.reduce((sum, p) => sum + p.interestAmount, 0);
                const lastPayment = debtPayments.sort((a, b) => 
                  new Date(b.date).getTime() - new Date(a.date).getTime()
                )[0];
                
                return (
                  <div key={debt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">{debt.creditorName}</h5>
                      <p className="text-sm text-gray-600">
                        {debtPayments.length} pagamento(s) • 
                        Último: {lastPayment ? new Date(lastPayment.date).toLocaleDateString('pt-PT') : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {showBalances ? formatCurrency(totalPaid) : '€•••••'}
                      </p>
                      <div className="flex space-x-4 text-xs">
                        <span className="text-green-600">
                          P: {showBalances ? formatCurrency(totalPrincipal) : '€•••••'}
                        </span>
                        <span className="text-red-600">
                          J: {showBalances ? formatCurrency(totalInterest) : '€•••••'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Saldo atual: {showBalances ? formatCurrency(debt.currentBalance) : '€•••••'}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Insights e Recomendações */}
      {filteredPayments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">💡 Insights dos Pagamentos</h4>
          <div className="space-y-3 text-sm text-blue-800">
            {paymentStats.totalInterest > paymentStats.totalPrincipal && (
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <p>
                  <strong>Atenção:</strong> Está a pagar mais juros ({showBalances ? formatCurrency(paymentStats.totalInterest) : '€•••••'}) 
                  do que principal ({showBalances ? formatCurrency(paymentStats.totalPrincipal) : '€•••••'}). 
                  Considere aumentar os pagamentos ou focar nas dívidas com maior taxa de juro.
                </p>
              </div>
            )}
            
            {paymentStats.paymentsByType.extra && (
              <div className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-green-600 mt-0.5" />
                <p>
                  <strong>Parabéns!</strong> Fez {paymentStats.paymentsByType.extra} pagamento(s) extra. 
                  Isto ajuda a reduzir o tempo de quitação e os juros totais.
                </p>
              </div>
            )}
            
            {paymentStats.averagePayment > 0 && (
              <div className="flex items-start space-x-2">
                <DollarSign className="h-4 w-4 text-blue-600 mt-0.5" />
                <p>
                  A sua média de pagamento é {showBalances ? formatCurrency(paymentStats.averagePayment) : '€•••••'}. 
                  {paymentStats.averagePayment > 100 ? 
                    'Está no bom caminho para quitar as dívidas!' :
                    'Considere aumentar os pagamentos se possível.'
                  }
                </p>
              </div>
            )}

            {paymentStats.paymentCount > 5 && (
              <div className="flex items-start space-x-2">
                <Calendar className="h-4 w-4 text-purple-600 mt-0.5" />
                <p>
                  <strong>Consistência:</strong> Já registou {paymentStats.paymentCount} pagamentos. 
                  Manter a regularidade é fundamental para quitar as dívidas.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formulário */}
      {showForm && (
        <PaymentForm
          debts={debts}
          payment={editingPayment}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
        />
      )}
    </div>
  );
};