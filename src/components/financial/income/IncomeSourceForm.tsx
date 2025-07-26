// src/components/income/IncomeSourceForm.tsx

import React, { useState, useEffect } from 'react';
import { IncomeSource, IncomeSourceFormData } from '../../../types/income';
import { Modal } from '../../ui/Modal';


interface IncomeSourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editData?: IncomeSource | null;
}

const CATEGORIES = [
  { value: 'salary', label: 'Salário', icon: '💼' },
  { value: 'freelance', label: 'Freelance', icon: '🎨' },
  { value: 'business', label: 'Negócio', icon: '🏢' },
  { value: 'investments', label: 'Investimentos', icon: '📈' },
  { value: 'other', label: 'Outros', icon: '💰' }
] as const;

export const IncomeSourceForm: React.FC<IncomeSourceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData
}) => {
  const [formData, setFormData] = useState<IncomeSourceFormData>({
    name: '',
    category: 'salary',
    description: '',
    defaultAmount: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<IncomeSourceFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form quando abre/fecha ou muda editData
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          name: editData.name,
          category: editData.category,
          description: editData.description || '',
          defaultAmount: editData.defaultAmount?.toString() || '',
          isActive: editData.isActive
        });
      } else {
        setFormData({
          name: '',
          category: 'salary',
          description: '',
          defaultAmount: '',
          isActive: true
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, editData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<IncomeSourceFormData> = {};

    // Nome é obrigatório
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar valor padrão se preenchido
    if (formData.defaultAmount && (parseFloat(formData.defaultAmount) <= 0 || isNaN(parseFloat(formData.defaultAmount)))) {
      newErrors.defaultAmount = 'Valor deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || undefined,
        defaultAmount: formData.defaultAmount ? parseFloat(formData.defaultAmount) : undefined,
        isActive: formData.isActive
      };

      onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof IncomeSourceFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editData ? "Editar Fonte de Renda" : "Nova Fonte de Renda"}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Fonte *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="Ex: Salário Empresa X, Freelance Design, etc."
            disabled={isSubmitting}
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isSubmitting}
          >
            {CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Detalhes sobre esta fonte de renda..."
            rows={3}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Opcional - adicione detalhes que ajudem a identificar esta fonte
          </p>
        </div>

        {/* Valor Padrão */}
        <div>
          <label htmlFor="defaultAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Valor Padrão (€)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            <input
              id="defaultAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.defaultAmount}
              onChange={(e) => handleInputChange('defaultAmount', e.target.value)}
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.defaultAmount ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>
          {errors.defaultAmount && (
            <p className="text-sm text-red-600 mt-1">{errors.defaultAmount}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Opcional - valor que aparecerá automaticamente ao criar novos rendimentos desta fonte
          </p>
        </div>

        {/* Status Ativo */}
        <div className="flex items-center space-x-3">
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <div>
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Fonte ativa
            </label>
            <p className="text-xs text-gray-500">
              Fontes inativas não aparecerão na lista ao criar novos rendimentos
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : editData ? 'Atualizar' : 'Criar Fonte'}
          </button>
        </div>
      </form>
    </Modal>
  );
};