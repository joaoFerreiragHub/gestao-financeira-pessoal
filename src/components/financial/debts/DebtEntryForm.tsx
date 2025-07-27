// src/components/financial/debts/DebtEntryForm.tsx

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Calculator, Calendar, Tag, AlertCircle } from 'lucide-react';
import { DebtEntry, DebtCategory, DebtEntryFormData } from '../../../types/debts';

interface DebtEntryFormProps {
  debt?: DebtEntry | null;
  categories: DebtCategory[];
  onSubmit: (data: DebtEntryFormData) => void;
  onCancel: () => void;
}

export const DebtEntryForm: React.FC<DebtEntryFormProps> = ({
  debt,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<DebtEntryFormData>({
    categoryId: '',
    creditorName: '',
    originalAmount: '',
    currentBalance: '',
    interestRate: '',
    monthlyPayment: '',
    minimumPayment: '',
    dueDate: '',
    startDate: '',
    description: '',
    priority: 'medium',
    debtType: 'installment',
    tags: [],
    collateral: '',
    isActive: true,
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Partial<DebtEntryFormData>>({});

  // Preencher formulário se estivermos editando
  useEffect(() => {
    if (debt) {
      setFormData({
        categoryId: debt.categoryId,
        creditorName: debt.creditorName,
        originalAmount: debt.originalAmount.toString(),
        currentBalance: debt.currentBalance.toString(),
        interestRate: debt.interestRate.toString(),
        monthlyPayment: debt.monthlyPayment.toString(),
        minimumPayment: debt.minimumPayment?.toString() || '', // Corrigido - usar optional chaining
        dueDate: debt.dueDate,
        startDate: debt.startDate,
        description: debt.description || '',
        priority: debt.priority,
        debtType: debt.debtType,
        tags: debt.tags || [],
        collateral: debt.collateral || '',
        isActive: debt.isActive,
      });
    }
  }, [debt]);

  const validateForm = (): boolean => {
    const newErrors: Partial<DebtEntryFormData> = {};

    if (!formData.categoryId) {
      newErrors.categoryId = 'Selecione uma categoria';
    }

    if (!formData.creditorName.trim()) {
      newErrors.creditorName = 'Nome do credor é obrigatório';
    }

    if (!formData.originalAmount || parseFloat(formData.originalAmount) <= 0) {
      newErrors.originalAmount = 'Valor original deve ser maior que zero';
    }

    if (!formData.currentBalance || parseFloat(formData.currentBalance) < 0) {
      newErrors.currentBalance = 'Saldo atual não pode ser negativo';
    }

    if (!formData.interestRate || parseFloat(formData.interestRate) < 0) {
      newErrors.interestRate = 'Taxa de juro não pode ser negativa';
    }

    if (!formData.monthlyPayment || parseFloat(formData.monthlyPayment) <= 0) {
      newErrors.monthlyPayment = 'Pagamento mensal deve ser maior que zero';
    }

    if (!formData.minimumPayment || parseFloat(formData.minimumPayment) <= 0) {
      newErrors.minimumPayment = 'Pagamento mínimo deve ser maior que zero';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }

    // Validar que a data de vencimento não é anterior à data de início
    if (formData.startDate && formData.dueDate) {
      const startDate = new Date(formData.startDate);
      const dueDate = new Date(formData.dueDate);
      if (dueDate < startDate) {
        newErrors.dueDate = 'Data de vencimento deve ser posterior à data de início';
      }
    }

    // Validar que o pagamento mínimo não é maior que o pagamento mensal
    if (formData.monthlyPayment && formData.minimumPayment) {
      const monthly = parseFloat(formData.monthlyPayment);
      const minimum = parseFloat(formData.minimumPayment);
      if (minimum > monthly) {
        newErrors.minimumPayment = 'Pagamento mínimo não pode ser maior que o pagamento mensal';
      }
    }

    // Validar que o saldo atual não é maior que o valor original
    if (formData.originalAmount && formData.currentBalance) {
      const original = parseFloat(formData.originalAmount);
      const current = parseFloat(formData.currentBalance);
      if (current > original) {
        newErrors.currentBalance = 'Saldo atual não pode ser maior que o valor original';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Limpar erro deste campo
    if (errors[name as keyof DebtEntryFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Auto-preencher pagamento mínimo se não foi definido
    if (name === 'monthlyPayment' && value && !formData.minimumPayment) {
      const monthlyValue = parseFloat(value);
      if (monthlyValue > 0) {
        // Sugerir 50% do pagamento mensal como mínimo
        const suggestedMinimum = (monthlyValue * 0.5).toFixed(2);
        setFormData(prev => ({
          ...prev,
          minimumPayment: suggestedMinimum,
        }));
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  // Calcular algumas métricas úteis
  const calculateMetrics = () => {
    const original = parseFloat(formData.originalAmount) || 0;
    const current = parseFloat(formData.currentBalance) || 0;
    const monthly = parseFloat(formData.monthlyPayment) || 0;
    const rate = parseFloat(formData.interestRate) || 0;
    
    const amountPaid = original - current;
    const percentagePaid = original > 0 ? (amountPaid / original) * 100 : 0;
    
    // Estimativa simples de meses para quitar (sem juros compostos)
    const monthsToPayOff = monthly > 0 ? Math.ceil(current / monthly) : 0;
    
    return {
      amountPaid,
      percentagePaid,
      monthsToPayOff,
      monthlyInterest: rate > 0 ? (current * rate / 100 / 12) : 0,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {debt ? 'Editar Dívida' : 'Nova Dívida'}
              </h2>
              <p className="text-sm text-gray-600">
                {debt ? 'Atualize os dados da dívida' : 'Adicione uma nova dívida ao seu controlo financeiro'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Categoria e Credor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.categoryId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.filter(cat => cat.isActive).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.categoryId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Credor *
              </label>
              <input
                type="text"
                name="creditorName"
                value={formData.creditorName}
                onChange={handleInputChange}
                placeholder="Ex: Banco CTT, Cartão Continente..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.creditorName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.creditorName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.creditorName}
                </p>
              )}
            </div>
          </div>

          {/* Valores Monetários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Original *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">€</span>
                <input
                  type="number"
                  name="originalAmount"
                  value={formData.originalAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.originalAmount ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.originalAmount && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.originalAmount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saldo Atual *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">€</span>
                <input
                  type="number"
                  name="currentBalance"
                  value={formData.currentBalance}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.currentBalance ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.currentBalance && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.currentBalance}
                </p>
              )}
              {metrics.amountPaid > 0 && (
                <p className="mt-1 text-xs text-green-600">
                  Já pagou €{metrics.amountPaid.toFixed(2)} ({metrics.percentagePaid.toFixed(1)}%)
                </p>
              )}
            </div>
          </div>

          {/* Taxa de Juro e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Juro Anual *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  max="100"
                  className={`w-full pr-8 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.interestRate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
              {errors.interestRate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.interestRate}
                </p>
              )}
              {metrics.monthlyInterest > 0 && (
                <p className="mt-1 text-xs text-gray-600">
                  Juros mensais: ~€{metrics.monthlyInterest.toFixed(2)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Dívida
              </label>
              <select
                name="debtType"
                value={formData.debtType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="installment">Prestações</option>
                <option value="revolving">Rotativo</option>
                <option value="fixed">Fixo</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {formData.debtType === 'installment' && 'Pagamentos fixos mensais'}
                {formData.debtType === 'revolving' && 'Saldo variável (ex: cartão de crédito)'}
                {formData.debtType === 'fixed' && 'Valor fixo a prazo'}
              </p>
            </div>
          </div>

          {/* Pagamentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pagamento Mensal *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">€</span>
                <input
                  type="number"
                  name="monthlyPayment"
                  value={formData.monthlyPayment}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.monthlyPayment ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.monthlyPayment && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.monthlyPayment}
                </p>
              )}
              {metrics.monthsToPayOff > 0 && (
                <p className="mt-1 text-xs text-gray-600">
                  Tempo estimado: {metrics.monthsToPayOff} meses
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pagamento Mínimo *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">€</span>
                <input
                  type="number"
                  name="minimumPayment"
                  value={formData.minimumPayment}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.minimumPayment ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.minimumPayment && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.minimumPayment}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Valor mínimo exigido pelo credor
              </p>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Prioridade e Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div className="flex items-center space-x-4 pt-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">Dívida ativa</span>
              </label>
            </div>
          </div>

          {/* Garantia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Garantia/Colateral
            </label>
            <input
              type="text"
              name="collateral"
              value={formData.collateral}
              onChange={handleInputChange}
              placeholder="Ex: Casa, Carro, Não aplicável..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Nova etiqueta..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Notas adicionais sobre esta dívida..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Preview da Categoria Selecionada */}
          {selectedCategory && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categoria Selecionada:</h4>
              <div className="flex items-center space-x-3">
                <span className="text-lg">{selectedCategory.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{selectedCategory.name}</p>
                  <p className="text-sm text-gray-600">{selectedCategory.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Resumo dos Cálculos */}
          {(formData.originalAmount || formData.currentBalance || formData.monthlyPayment) && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">📊 Resumo Automático:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {metrics.amountPaid > 0 && (
                  <div>
                    <span className="text-blue-600">Já pago:</span>
                    <span className="font-medium text-blue-800 ml-1">
                      €{metrics.amountPaid.toFixed(2)} ({metrics.percentagePaid.toFixed(1)}%)
                    </span>
                  </div>
                )}
                {metrics.monthlyInterest > 0 && (
                  <div>
                    <span className="text-blue-600">Juros mensais:</span>
                    <span className="font-medium text-blue-800 ml-1">
                      ~€{metrics.monthlyInterest.toFixed(2)}
                    </span>
                  </div>
                )}
                {metrics.monthsToPayOff > 0 && (
                  <div>
                    <span className="text-blue-600">Tempo estimado:</span>
                    <span className="font-medium text-blue-800 ml-1">
                      {metrics.monthsToPayOff} meses
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {debt ? 'Atualizar Dívida' : 'Criar Dívida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};