// src/components/income/IncomeEntryForm.tsx

import React, { useState, useEffect } from 'react';
import { IncomeEntry, IncomeEntryFormData, IncomeSource } from '../../../types/income';
import { Modal } from '../../ui/Modal';


interface IncomeEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IncomeEntry, 'id' | 'sourceName' | 'createdAt' | 'updatedAt'>) => void;
  editData?: IncomeEntry | null;
  sources: IncomeSource[];
}

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' }
] as const;

export const IncomeEntryForm: React.FC<IncomeEntryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  sources
}) => {
  const [formData, setFormData] = useState<IncomeEntryFormData>({
    sourceId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    frequency: 'monthly',
    tags: []
  });

  const [errors, setErrors] = useState<Partial<IncomeEntryFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Reset form quando abre/fecha ou muda editData
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          sourceId: editData.sourceId,
          amount: editData.amount.toString(),
          date: editData.date,
          description: editData.description || '',
          isRecurring: editData.isRecurring,
          frequency: editData.frequency || 'monthly',
          tags: editData.tags || []
        });
        setTagInput((editData.tags || []).join(', '));
      } else {
        setFormData({
          sourceId: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          isRecurring: false,
          frequency: 'monthly',
          tags: []
        });
        setTagInput('');
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, editData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<IncomeEntryFormData> = {};

    // Fonte é obrigatória
    if (!formData.sourceId) {
      newErrors.sourceId = 'Selecione uma fonte de renda';
    }

    // Valor é obrigatório e deve ser positivo
    if (!formData.amount) {
      newErrors.amount = 'Valor é obrigatório';
    } else if (parseFloat(formData.amount) <= 0 || isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    // Data é obrigatória
    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Final do dia de hoje
      
      if (selectedDate > today) {
        newErrors.date = 'Data não pode ser no futuro';
      }
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
      // Processar tags
      const processedTags = tagInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const submitData = {
        sourceId: formData.sourceId,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description.trim() || undefined,
        isRecurring: formData.isRecurring,
        frequency: formData.isRecurring ? formData.frequency : undefined,
        tags: processedTags.length > 0 ? processedTags : undefined
      };

      onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof IncomeEntryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSourceChange = (sourceId: string) => {
    handleInputChange('sourceId', sourceId);
    
    // Auto-preenchimento do valor baseado na fonte selecionada
    const selectedSource = sources.find(s => s.id === sourceId);
    if (selectedSource?.defaultAmount && !formData.amount) {
      handleInputChange('amount', selectedSource.defaultAmount.toString());
    }
  };

  const activeSources = sources.filter(source => source.isActive);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editData ? "Editar Rendimento" : "Novo Rendimento"}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        
        {/* Fonte de Renda */}
        <div>
          <label htmlFor="sourceId" className="block text-sm font-medium text-gray-700 mb-1">
            Fonte de Renda *
          </label>
          <select
            id="sourceId"
            value={formData.sourceId}
            onChange={(e) => handleSourceChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.sourceId ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Selecione uma fonte</option>
            {activeSources.map(source => (
              <option key={source.id} value={source.id}>
                {source.name} ({source.category})
                {source.defaultAmount && ` - €${source.defaultAmount}`}
              </option>
            ))}
          </select>
          {errors.sourceId && (
            <p className="text-sm text-red-600 mt-1">{errors.sourceId}</p>
          )}
          {activeSources.length === 0 && (
            <p className="text-sm text-orange-600 mt-1">
              Nenhuma fonte ativa encontrada. Crie uma fonte primeiro.
            </p>
          )}
        </div>

        {/* Valor */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Valor (€) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Data */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Data do Rendimento *
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            disabled={isSubmitting}
            max={new Date().toISOString().split('T')[0]} // Não permitir datas futuras
          />
          {errors.date && (
            <p className="text-sm text-red-600 mt-1">{errors.date}</p>
          )}
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
            placeholder="Detalhes sobre este rendimento..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {/* Recorrência */}
        <div className="flex items-center space-x-3">
          <input
            id="isRecurring"
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <div>
            <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
              Rendimento recorrente
            </label>
            <p className="text-xs text-gray-500">
              Marque se este rendimento se repete regularmente
            </p>
          </div>
        </div>

        {/* Frequência (se recorrente) */}
        {formData.isRecurring && (
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Frequência
            </label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              {FREQUENCY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="ex: bonus, extra, projeto (separadas por vírgula)"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Opcional - use tags para categorizar e filtrar seus rendimentos
          </p>
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
            disabled={isSubmitting || activeSources.length === 0}
          >
            {isSubmitting ? 'Salvando...' : editData ? 'Atualizar' : 'Adicionar Rendimento'}
          </button>
        </div>
      </form>
    </Modal>
  );
};