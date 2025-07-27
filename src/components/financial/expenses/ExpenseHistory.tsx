// src/components/financial/expenses/ExpenseHistory.tsx

import React, { useState } from 'react';
import { Edit, Trash2, Tag, Calendar, CreditCard, AlertCircle, CheckCircle, MoreVertical } from 'lucide-react';
import { ExpenseEntry, ExpenseCategory } from '../../../types/expenses';

interface ExpenseHistoryProps {
  entries: ExpenseEntry[];
  categories: ExpenseCategory[];
  showBalances: boolean;
  onEditEntry: (entry: ExpenseEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  formatCurrency: (amount: number) => string;
}

export const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({
  entries,
  categories,
  showBalances,
  onEditEntry,
  onDeleteEntry,
  formatCurrency,
}) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <span className="text-sm">💵</span>;
      case 'transfer':
        return <span className="text-sm">🏦</span>;
      case 'pix':
        return <span className="text-sm">📱</span>;
      default:
        return <span className="text-sm">💳</span>;
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'card':
        return 'Cartão';
      case 'cash':
        return 'Dinheiro';
      case 'transfer':
        return 'Transferência';
      case 'pix':
        return 'PIX';
      default:
        return 'Outro';
    }
  };

  const handleDeleteConfirm = (entryId: string) => {
    onDeleteEntry(entryId);
    setShowDeleteConfirm(null);
  };

  if (entries.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma despesa encontrada</h3>
        <p className="text-gray-600">
          Não há despesas que correspondam aos filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const category = categories.find(c => c.id === entry.categoryId);
        const isExpanded = expandedEntry === entry.id;

        return (
          <div
            key={entry.id}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Ícone da Categoria */}
                  <div className={`p-2 rounded-lg bg-${category?.color || 'gray'}-100`}>
                    <span className="text-lg">{category?.icon || '📦'}</span>
                  </div>

                  {/* Informações Principais */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {entry.description || entry.categoryName}
                      </h4>
                      {entry.isEssential ? (
                        <span title="Despesa Essencial">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </span>
                      ) : (
                        <span title="Despesa Supérflua">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        </span>
                      )}
                      {entry.isRecurring && (
                        <div className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Recorrente
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(entry.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {entry.categoryName}
                      </span>
                      <span className="flex items-center gap-1">
                        {getPaymentMethodIcon(entry.paymentMethod)}
                        {getPaymentMethodLabel(entry.paymentMethod)}
                      </span>
                    </div>
                  </div>

                  {/* Valor */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">
                      {showBalances ? formatCurrency(entry.amount) : '€•••••'}
                    </p>
                    {entry.frequency && (
                      <p className="text-xs text-gray-500">
                        /{entry.frequency === 'monthly' ? 'mês' : 
                          entry.frequency === 'yearly' ? 'ano' : 
                          entry.frequency === 'weekly' ? 'semana' : 'dia'}
                      </p>
                    )}
                  </div>

                  {/* Menu de Ações */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedEntry(isExpanded ? null : entry.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Detalhes Expandidos */}
            {isExpanded && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categoria</p>
                      <p className="text-sm text-gray-900 mt-1">{entry.categoryName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {entry.isEssential ? 'Essencial' : 'Supérflua'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Criado em</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(entry.createdAt).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Última atualização</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(entry.updatedAt).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEntry(entry);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar despesa"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(entry.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Excluir despesa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {entry.description && entry.description !== entry.categoryName && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Descrição</p>
                    <p className="text-sm text-gray-900 mt-1">{entry.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza de que deseja excluir esta despesa? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};