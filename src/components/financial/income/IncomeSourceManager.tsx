// src/components/income/IncomeSourceManager.tsx

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff } from 'lucide-react';

import { IncomeSourceForm } from './IncomeSourceForm';
import { IncomeEntry, IncomeSource } from '../../../types/income';

interface IncomeSourceManagerProps {
  sources: IncomeSource[];
  entries: IncomeEntry[];
  showBalances: boolean;
  onAddSource: (source: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateSource: (id: string, updates: Partial<IncomeSource>) => void;
  onDeleteSource: (id: string) => void;
}

const CATEGORY_CONFIG = {
  salary: { label: 'Salário', icon: '💼', color: 'bg-blue-100 text-blue-700' },
  freelance: { label: 'Freelance', icon: '🎨', color: 'bg-purple-100 text-purple-700' },
  business: { label: 'Negócio', icon: '🏢', color: 'bg-green-100 text-green-700' },
  investments: { label: 'Investimentos', icon: '📈', color: 'bg-orange-100 text-orange-700' },
  other: { label: 'Outros', icon: '💰', color: 'bg-gray-100 text-gray-700' }
} as const;

export const IncomeSourceManager: React.FC<IncomeSourceManagerProps> = ({
  sources,
  entries,
  showBalances,
  onAddSource,
  onUpdateSource,
  onDeleteSource
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState<IncomeSource | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getSourceStats = (sourceId: string) => {
    const sourceEntries = entries.filter(entry => entry.sourceId === sourceId);
    const total = sourceEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const count = sourceEntries.length;
    
    // Último rendimento
    const lastEntry = sourceEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    return {
      total,
      count,
      lastEntry: lastEntry ? new Date(lastEntry.date) : null,
      average: count > 0 ? total / count : 0
    };
  };

  const handleEdit = (source: IncomeSource) => {
    setEditingSource(source);
    setShowForm(true);
  };

  const handleDelete = (source: IncomeSource) => {
    const sourceStats = getSourceStats(source.id);
    
    if (sourceStats.count > 0) {
      const confirmMessage = `Esta fonte tem ${sourceStats.count} rendimento(s) registrado(s). ` +
        `Ao excluir a fonte, todos os rendimentos relacionados também serão removidos. ` +
        `Tem certeza que deseja continuar?`;
      
      if (!confirm(confirmMessage)) {
        return;
      }
    } else {
      if (!confirm(`Tem certeza que deseja excluir a fonte "${source.name}"?`)) {
        return;
      }
    }
    
    onDeleteSource(source.id);
  };

  const handleFormSubmit = (data: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSource) {
      onUpdateSource(editingSource.id, data);
    } else {
      onAddSource(data);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSource(null);
  };

  const toggleSourceStatus = (source: IncomeSource) => {
    onUpdateSource(source.id, { isActive: !source.isActive });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Fontes de Renda</h3>
          <p className="text-sm text-gray-600">
            Gerencie suas diferentes fontes de rendimento
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova Fonte
        </button>
      </div>

      {/* Lista de Fontes */}
      {sources.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma fonte de renda cadastrada
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando sua primeira fonte de renda para organizar melhor seus rendimentos.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Criar Primeira Fonte
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map(source => {
            const config = CATEGORY_CONFIG[source.category];
            const stats = getSourceStats(source.id);
            
            return (
              <div
                key={source.id}
                className={`bg-white rounded-xl border-2 p-4 transition-all ${
                  source.isActive 
                    ? 'border-gray-200 hover:border-green-300 hover:shadow-md' 
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                {/* Header da Fonte */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h4 className={`font-medium ${source.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                        {source.name}
                      </h4>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleSourceStatus(source)}
                      className={`p-1 rounded transition-colors ${
                        source.isActive 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={source.isActive ? 'Desativar fonte' : 'Ativar fonte'}
                    >
                      {source.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </button>
                    <button
                      onClick={() => handleEdit(source)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Editar fonte"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(source)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Excluir fonte"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Descrição */}
                {source.description && (
                  <p className={`text-sm mb-3 ${source.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                    {source.description}
                  </p>
                )}

                {/* Estatísticas */}
                <div className="space-y-2">
                  {/* Valor padrão */}
                  {source.defaultAmount && (
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${source.isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                        Valor padrão:
                      </span>
                      <span className={`text-sm font-medium ${source.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                        {showBalances ? formatCurrency(source.defaultAmount) : '€•••••'}
                      </span>
                    </div>
                  )}

                  {/* Total acumulado */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${source.isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                      Total acumulado:
                    </span>
                    <span className={`text-sm font-medium ${source.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {showBalances ? formatCurrency(stats.total) : '€•••••'}
                    </span>
                  </div>

                  {/* Número de entradas */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${source.isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                      Registros:
                    </span>
                    <span className={`text-sm ${source.isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                      {stats.count} {stats.count === 1 ? 'entrada' : 'entradas'}
                    </span>
                  </div>

                  {/* Último rendimento */}
                  {stats.lastEntry && (
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${source.isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                        Último:
                      </span>
                      <span className={`text-xs ${source.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                        {stats.lastEntry.toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      source.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {source.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="text-xs text-gray-400">
                      Criado em {new Date(source.createdAt).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Formulário */}
      <IncomeSourceForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editData={editingSource}
      />
    </div>
  );
};