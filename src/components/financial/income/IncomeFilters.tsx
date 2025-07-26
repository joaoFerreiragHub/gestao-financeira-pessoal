// src/components/income/IncomeFilters.tsx

import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Download, 
  Calendar,
  X,
  ChevronDown
} from 'lucide-react';
import { IncomeFilters as IncomeFiltersType, IncomeSource } from '../../../types/income';

interface IncomeFiltersProps {
  filters: IncomeFiltersType;
  sources: IncomeSource[];
  onFiltersChange: (filters: IncomeFiltersType) => void;
  onExport?: () => void;
  totalEntries: number;
  filteredEntries: number;
}

const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todos os períodos' },
  { value: 'thisMonth', label: 'Este mês' },
  { value: 'lastMonth', label: 'Mês anterior' },
  { value: 'thisYear', label: 'Este ano' },
  { value: 'lastYear', label: 'Ano anterior' },
  { value: 'custom', label: 'Período personalizado' }
] as const;

export const IncomeFilters: React.FC<IncomeFiltersProps> = ({
  filters,
  sources,
  onFiltersChange,
  onExport,
  totalEntries,
  filteredEntries
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof IncomeFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      period: 'all',
      sources: [],
      search: '',
      tags: [],
      amountRange: undefined,
      dateRange: undefined
    });
    setShowAdvanced(false);
  };

  const hasActiveFilters = 
    filters.period !== 'all' ||
    filters.sources.length > 0 ||
    filters.search !== '' ||
    (filters.tags && filters.tags.length > 0) ||
    filters.amountRange ||
    filters.dateRange;

  const activeSources = sources.filter(source => source.isActive);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Filtros ({filteredEntries} de {totalEntries} rendimentos)
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Limpar
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            Avançado
            <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
          {onExport && (
            <button
              onClick={onExport}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Exportar
            </button>
          )}
        </div>
      </div>

      {/* Filtros Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Período */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Período
          </label>
          <select
            value={filters.period}
            onChange={(e) => updateFilter('period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PERIOD_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fontes */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Fontes de Renda
          </label>
          <select
            multiple
            value={filters.sources}
            onChange={(e) => {
              const selectedSources = Array.from(e.target.selectedOptions, option => option.value);
              updateFilter('sources', selectedSources);
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
          >
            <option value="">Todas as fontes</option>
            {activeSources.map(source => (
              <option key={source.id} value={source.id}>
                {source.name} ({source.category})
              </option>
            ))}
          </select>
          {filters.sources.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {filters.sources.length} fonte(s) selecionada(s)
            </p>
          )}
        </div>

        {/* Busca */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descrição..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Período Personalizado */}
      {filters.period === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.dateRange?.start || ''}
              onChange={(e) => updateFilter('dateRange', {
                ...filters.dateRange,
                start: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={filters.dateRange?.end || ''}
              onChange={(e) => updateFilter('dateRange', {
                ...filters.dateRange,
                end: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Filtros Avançados */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </h4>

          {/* Faixa de Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Valor Mínimo (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={filters.amountRange?.min || ''}
                onChange={(e) => updateFilter('amountRange', {
                  ...filters.amountRange,
                  min: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Valor Máximo (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={filters.amountRange?.max || ''}
                onChange={(e) => updateFilter('amountRange', {
                  ...filters.amountRange,
                  max: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              placeholder="ex: bonus, extra, projeto"
              value={filters.tags?.join(', ') || ''}
              onChange={(e) => {
                const tags = e.target.value
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(tag => tag.length > 0);
                updateFilter('tags', tags.length > 0 ? tags : undefined);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtros Rápidos */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Filtros Rápidos
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('period', 'thisMonth')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  filters.period === 'thisMonth'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Este Mês
              </button>
              <button
                onClick={() => updateFilter('period', 'thisYear')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  filters.period === 'thisYear'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Este Ano
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
                  updateFilter('period', 'custom');
                  updateFilter('dateRange', {
                    start: thirtyDaysAgo.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                  });
                }}
                className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Últimos 30 Dias
              </button>
              <button
                onClick={() => {
                  updateFilter('amountRange', { min: 1000, max: undefined });
                }}
                className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Acima de €1000
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resumo dos Filtros Ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-500">Filtros ativos:</span>
          
          {filters.period !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              Período: {PERIOD_OPTIONS.find(p => p.value === filters.period)?.label}
              <button
                onClick={() => updateFilter('period', 'all')}
                className="hover:bg-blue-200 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.sources.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              {filters.sources.length} fonte(s)
              <button
                onClick={() => updateFilter('sources', [])}
                className="hover:bg-green-200 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
              Busca: "{filters.search}"
              <button
                onClick={() => updateFilter('search', '')}
                className="hover:bg-purple-200 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.amountRange && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
              Valor: €{filters.amountRange.min || 0} - €{filters.amountRange.max || '∞'}
              <button
                onClick={() => updateFilter('amountRange', undefined)}
                className="hover:bg-orange-200 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};