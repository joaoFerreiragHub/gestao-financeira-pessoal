// src/components/income/IncomeHistory.tsx

import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Trash2, 
  TrendingUp,
  Calendar,
  Tag,
  Repeat
} from 'lucide-react';
import { GroupByPeriod, IncomeEntry, IncomeSource } from '../../../types/income';


interface IncomeHistoryProps {
  entries: IncomeEntry[];
  sources: IncomeSource[];
  showBalances: boolean;
  onEditEntry: (entry: IncomeEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const IncomeHistory: React.FC<IncomeHistoryProps> = ({
  entries,
  sources,
  showBalances,
  onEditEntry,
  onDeleteEntry
}) => {
  const [groupBy, setGroupBy] = useState<GroupByPeriod>('month');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string, format: GroupByPeriod): string => {
    const date = new Date(dateString);
    switch (format) {
      case 'day':
        return date.toLocaleDateString('pt-PT');
      case 'month':
        return date.toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' });
      case 'year':
        return date.getFullYear().toString();
      default:
        return dateString;
    }
  };

  const getSourceName = (sourceId: string): string => {
    const source = sources.find(s => s.id === sourceId);
    return source?.name || 'Fonte desconhecida';
  };

  const groupedEntries = useMemo(() => {
    const grouped: { [key: string]: IncomeEntry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      let key: string;
      
      switch (groupBy) {
        case 'day':
          key = entry.date;
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
        default:
          key = entry.date;
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(entry);
    });

    // Ordenar grupos por data (mais recente primeiro)
    // Ordenar entradas dentro de cada grupo por data (mais recente primeiro)
    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, groupEntries]) => [
        key,
        groupEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      ] as [string, IncomeEntry[]]);
  }, [entries, groupBy]);

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const handleDeleteEntry = (entry: IncomeEntry) => {
    const confirmMessage = `Tem certeza que deseja excluir o rendimento de ${formatCurrency(entry.amount)} de ${entry.sourceName}?`;
    if (confirm(confirmMessage)) {
      onDeleteEntry(entry.id);
    }
  };

  // Expandir o primeiro grupo por padrão
  React.useEffect(() => {
    if (groupedEntries.length > 0 && expandedGroups.size === 0) {
      setExpandedGroups(new Set([groupedEntries[0][0]]));
    }
  }, [groupedEntries]);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Histórico de Rendimentos</h3>
            <p className="text-sm text-gray-600">
              {entries.length} {entries.length === 1 ? 'rendimento registrado' : 'rendimentos registrados'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Agrupar por:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupByPeriod)}
              className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="day">Dia</option>
              <option value="month">Mês</option>
              <option value="year">Ano</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-h-96 overflow-y-auto">
        {groupedEntries.length === 0 ? (
          <div className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum rendimento registrado
            </h3>
            <p className="text-gray-500">
              Comece adicionando seu primeiro rendimento para ver o histórico aqui.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {groupedEntries.map(([groupKey, groupEntries]) => {
              const totalGroup = groupEntries.reduce((sum, entry) => sum + entry.amount, 0);
              const isExpanded = expandedGroups.has(groupKey);
              
              return (
                <div key={groupKey}>
                  {/* Header do Grupo */}
                  <button
                    onClick={() => toggleGroup(groupKey)}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isExpanded ? 
                          <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        }
                        <div>
                          <span className="font-medium text-gray-900">
                            {formatDate(groupKey, groupBy)}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({groupEntries.length} {groupEntries.length === 1 ? 'entrada' : 'entradas'})
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-green-600">
                          {showBalances ? formatCurrency(totalGroup) : '€•••••'}
                        </span>
                      </div>
                    </div>
                  </button>
                  
                  {/* Entradas do Grupo */}
                  {isExpanded && (
                    <div className="bg-gray-50">
                      {groupEntries.map((entry, index) => (
                        <div 
                          key={entry.id} 
                          className={`px-4 py-3 mx-4 mb-2 bg-white rounded-lg border-l-4 border-green-200 ${
                            index === groupEntries.length - 1 ? 'mb-4' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* Fonte e Valor */}
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {entry.sourceName}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      {new Date(entry.date).toLocaleDateString('pt-PT', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </span>
                                    {entry.isRecurring && (
                                      <>
                                        <Repeat className="h-3 w-3 text-blue-500" />
                                        <span className="text-xs px-1 bg-blue-100 text-blue-700 rounded">
                                          {entry.frequency === 'monthly' ? 'Mensal' : 
                                           entry.frequency === 'yearly' ? 'Anual' :
                                           entry.frequency === 'weekly' ? 'Semanal' : 'Diário'}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <span className="font-semibold text-green-600 text-lg">
                                  {showBalances ? formatCurrency(entry.amount) : '€•••••'}
                                </span>
                              </div>

                              {/* Descrição */}
                              {entry.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {entry.description}
                                </p>
                              )}

                              {/* Tags */}
                              {entry.tags && entry.tags.length > 0 && (
                                <div className="flex items-center gap-1 mb-2">
                                  <Tag className="h-3 w-3 text-gray-400" />
                                  <div className="flex flex-wrap gap-1">
                                    {entry.tags.map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Ações */}
                            <div className="flex items-center gap-1 ml-4">
                              <button
                                onClick={() => onEditEntry(entry)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title="Editar rendimento"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(entry)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                title="Excluir rendimento"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};