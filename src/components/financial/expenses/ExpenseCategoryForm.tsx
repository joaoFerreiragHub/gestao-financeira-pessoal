// src/components/financial/expenses/ExpenseCategoryForm.tsx

import React, { useState, useEffect } from 'react';
import { X, Tag, Palette, DollarSign, FileText, Eye, EyeOff } from 'lucide-react';
import { ExpenseCategory } from '../../../types/expenses';

interface ExpenseCategoryFormProps {
  category?: ExpenseCategory | null;
  onSubmit: (data: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const AVAILABLE_ICONS = [
  '🍽️', '🚗', '🏠', '⚕️', '📚', '🎬', '👕', '💻', '🛡️', '📄',
  '💰', '🎯', '🏃‍♂️', '✈️', '🎵', '🛍️', '🔧', '📱', '🎮', '☕',
  '💊', '🚌', '⛽', '🏥', '🎪', '📦', '🎂', '🌟', '💡', '🔑'
];

const AVAILABLE_COLORS = [
  { name: 'Vermelho', value: 'red' },
  { name: 'Azul', value: 'blue' },
  { name: 'Verde', value: 'green' },
  { name: 'Amarelo', value: 'yellow' },
  { name: 'Roxo', value: 'purple' },
  { name: 'Rosa', value: 'pink' },
  { name: 'Índigo', value: 'indigo' },
  { name: 'Laranja', value: 'orange' },
  { name: 'Ciano', value: 'cyan' },
  { name: 'Cinza', value: 'gray' },
  { name: 'Ardósia', value: 'slate' }
];

export const ExpenseCategoryForm: React.FC<ExpenseCategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: 'gray',
    budgetLimit: '',
    description: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color,
        budgetLimit: category.budgetLimit ? category.budgetLimit.toString() : '',
        description: category.description || '',
        isActive: category.isActive,
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.budgetLimit && isNaN(parseFloat(formData.budgetLimit))) {
      newErrors.budgetLimit = 'Limite de orçamento deve ser um número válido';
    }

    if (formData.budgetLimit && parseFloat(formData.budgetLimit) < 0) {
      newErrors.budgetLimit = 'Limite de orçamento deve ser positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color,
      budgetLimit: formData.budgetLimit ? parseFloat(formData.budgetLimit) : undefined,
      description: formData.description.trim() || undefined,
      isActive: formData.isActive,
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

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      orange: 'bg-orange-500',
      cyan: 'bg-cyan-500',
      gray: 'bg-gray-500',
      slate: 'bg-slate-500',
    };
    return colorMap[color] || colorMap.gray;
  };

  const getPreviewClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      slate: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {category ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Preview */}
          <div className="text-center">
            <div className={`inline-flex p-4 rounded-lg border-2 ${getPreviewClasses(formData.color)}`}>
              <span className="text-3xl">{formData.icon}</span>
            </div>
            <p className="mt-2 font-medium text-gray-900">
              {formData.name || 'Nome da Categoria'}
            </p>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4 inline mr-1" />
              Nome da Categoria *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Alimentação, Transporte..."
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={50}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Ícone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ícone
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{formData.icon}</span>
                  <span className="text-gray-700">Escolher ícone</span>
                </div>
                <span className="text-gray-400">▼</span>
              </button>
              
              {showIconPicker && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                  <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                    {AVAILABLE_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => {
                          handleChange('icon', icon);
                          setShowIconPicker(false);
                        }}
                        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                          formData.icon === icon ? 'bg-red-100 border-2 border-red-300' : ''
                        }`}
                      >
                        <span className="text-xl">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="h-4 w-4 inline mr-1" />
              Cor
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${getColorClasses(formData.color)}`}></div>
                  <span className="text-gray-700">
                    {AVAILABLE_COLORS.find(c => c.value === formData.color)?.name}
                  </span>
                </div>
                <span className="text-gray-400">▼</span>
              </button>
              
              {showColorPicker && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => {
                          handleChange('color', color.value);
                          setShowColorPicker(false);
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors hover:scale-105 ${
                          formData.color === color.value 
                            ? 'border-gray-400 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-full h-4 rounded ${getColorClasses(color.value)}`}></div>
                        <span className="text-xs text-gray-600 mt-1 block">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Limite de Orçamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Limite de Orçamento Mensal (€)
            </label>
            <input
              type="number"
              value={formData.budgetLimit}
              onChange={(e) => handleChange('budgetLimit', e.target.value)}
              placeholder="Ex: 500.00"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.budgetLimit ? 'border-red-300' : 'border-gray-300'
              }`}
              min="0"
              step="0.01"
            />
            {errors.budgetLimit && (
              <p className="text-red-600 text-sm mt-1">{errors.budgetLimit}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Opcional. Ajuda a controlar os gastos desta categoria.
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ex: Inclui supermercado, restaurantes e delivery..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              maxLength={200}
            />
            <p className="text-gray-500 text-sm mt-1">
              {formData.description.length}/200 caracteres
            </p>
          </div>

          {/* Status Ativo */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <div className="flex items-center gap-1">
                {formData.isActive ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  Categoria ativa
                </span>
              </div>
            </label>
            <p className="text-gray-500 text-sm mt-1 ml-7">
              Categorias inativas não aparecerão nas opções de nova despesa.
            </p>
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
              {category ? 'Atualizar' : 'Criar'} Categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};