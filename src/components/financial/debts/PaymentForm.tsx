// src/components/financial/debts/PaymentForm.tsx

import React, { useState } from 'react';
import { X, DollarSign, AlertCircle } from 'lucide-react';
import { DebtEntry, DebtPayment, DebtPaymentFormData } from '../../../types/debts';

interface PaymentFormProps {
  debts: DebtEntry[];
  payment?: DebtPayment | null;
  onSubmit: (data: DebtPaymentFormData) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
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