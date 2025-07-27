// src/components/financial/expenses/ExpenseEntryForm.tsx

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, CreditCard, Repeat, AlertCircle, CheckCircle } from 'lucide-react';
import { ExpenseEntry, ExpenseCategory } from '../../../types/expenses';

interface ExpenseEntryFormProps {
  entry?: ExpenseEntry | null;
  categories: ExpenseCategory[];
  onSubmit: (data: Omit<ExpenseEntry, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const PAYMENT_METHODS: Array<{
  value: ExpenseEntry['paymentMethod'];
  label: string;
  icon: string;
}> = [
  { value: 'card', label: 'Cartão', icon: '💳' },
  { value: 'cash', label: 'Dinheiro', icon: '💵' },
  { value: 'transfer', label: 'Transferência', icon: '🏦' },
  { value: 'pix', label: 'PIX', icon: '📱' },
  { value: 'other', label: 'Outro', icon: '❓' },
];

const FREQUENCIES: Array<{
  value: ExpenseEntry['frequency'];
  label: string;
}> = [
  { value: 'daily', label: 'Diariamente' },
  { value: 'weekly', label: 'Semanalmente' },
  { value: 'monthly', label: 'Mensalmente' },
  { value: 'yearly', label: 'Anualmente' },
];

export const ExpenseEntryForm: React.FC<ExpenseEntryFormProps> = ({
  entry,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    frequency: 'monthly' as ExpenseEntry['frequency'],
    tags: [] as string[],
    paymentMethod: 'card' as ExpenseEntry['paymentMethod'],
    isEssential: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData({
        categoryId: entry.categoryId,
        amount: entry.amount.toString(),
        date: entry.date,
        description: entry.description || '',
        isRecurring: entry.isRecurring,
        frequency: entry.frequency || 'monthly',
        tags: entry.tags || [],
        paymentMethod: entry.paymentMethod || 'card',
        isEssential: entry.isEssential,
      });
    } else {
      // Se não há entrada para editar, usar a primeira categoria ativa como padrão
      const firstActiveCategory = categories.find(c => c.isActive);
      if (firstActiveCategory) {
        setFormData(prev => ({ ...prev, categoryId: firstActiveCategory.id }));
      }
    }
  }, [entry, categories]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Valor deve ser um número válido';
    }

    if (formData.amount && parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: Omit<ExpenseEntry, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'> = {
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description.trim() || undefined,
      isRecurring: formData.isRecurring,
      frequency: formData.isRecurring ? formData.frequency : undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      paymentMethod: formData.paymentMethod,
      isEssential: formData.isEssential,
    };

    onSubmit(submitData);
  };

const handleChange = <K extends keyof typeof formData>(
  field: K,
  value: typeof formData[K]
) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }
};

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const selectedCategory = categories.find(c => c.id === formData.categoryId);
  const activeCategories = categories.filter(c => c.isActive);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {entry ? 'Editar Despesa' : 'Nova Despesa'}
            </h3>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Preview da Categoria Selecionada */}
          {selectedCategory && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${selectedCategory.color}-100`}>
                  <span className="text-xl">{selectedCategory.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedCategory.name}</p>
                  {selectedCategory.description && (
                    <p className="text-sm text-gray-600">{selectedCategory.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4 inline mr-1" />
              Categoria *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.categoryId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma categoria...</option>
              {activeCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>
            )}
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Valor (€) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
                min="0"
                step="0.01"
              />
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Data *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Descrição
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ex: Supermercado Continente, Jantar no restaurante..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              maxLength={100}
            />
            <p className="text-gray-500 text-sm mt-1">
              {formData.description.length}/100 caracteres
            </p>
          </div>

          {/* Método de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="h-4 w-4 inline mr-1" />
              Método de Pagamento
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => handleChange('paymentMethod', method.value)}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    formData.paymentMethod === method.value
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-xl block">{method.icon}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Despesa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Despesa
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('isEssential', true)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.isEssential
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium">Essencial</span>
                  <p className="text-xs text-gray-600 mt-1">Necessário para vida básica</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('isEssential', false)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  !formData.isEssential
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium">Supérflua</span>
                  <p className="text-xs text-gray-600 mt-1">Luxo ou entretenimento</p>
                </div>
              </button>
            </div>
          </div>

          {/* Despesa Recorrente */}
          <div>
            <label className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => handleChange('isRecurring', e.target.checked)}
                className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <div className="flex items-center gap-1">
                <Repeat className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">
                  Despesa recorrente
                </span>
              </div>
            </label>

            {formData.isRecurring && (
              <select
                value={formData.frequency}
                onChange={(e) => handleChange('frequency', e.target.value as NonNullable<ExpenseEntry['frequency']>)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (máximo 5)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Adicionar tag..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 5}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Adicionar
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {entry ? 'Atualizar' : 'Criar'} Despesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};