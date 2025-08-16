// src/components/financial/expenses/ExpenseFilters.tsx

import React from 'react';
import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react';
import { ExpenseFilters as ExpenseFiltersType, ExpenseCategory } from '../../../types/financial/expenses';

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onFiltersChange: (filters: ExpenseFiltersType) => void;
  categories: ExpenseCategory[];
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
}) => {
  const handlePeriodChange = (period: ExpenseFiltersType['period']) => {
    onFiltersChange({ ...filters, period, dateRange: undefined });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleAmountRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    const currentRange = filters.amountRange || {};
    
    const newRange = {
      ...currentRange,
      [field]: numValue,
    };
    
    // Se ambos min e max são undefined, remove o amountRange completamente
    if (newRange.min === undefined && newRange.max === undefined) {
      onFiltersChange({
        ...filters,
        amountRange: undefined,
      });
    } else {
      onFiltersChange({
        ...filters,
        amountRange: newRange,
      });
    }
  };

  const handleEssentialFilter = (isEssential: boolean | null) => {
    onFiltersChange({ ...filters, isEssential });
  };

  const clearFilters = () => {
    onFiltersChange({
      period: 'all',
      categories: [],
      search: '',
      amountRange: undefined,
      isEssential: null,
    });
  };

  const hasActiveFilters = filters.period !== 'all' || 
                          filters.categories.length > 0 || 
                          filters.search !== '' ||
                          filters.amountRange ||
                          filters.isEssential !== null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Período
          </label>
          <select
            value={filters.period}
            onChange={(e) => handlePeriodChange(e.target.value as ExpenseFiltersType['period'])}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Todos os períodos</option>
            <option value="thisMonth">Este mês</option>
            <option value="lastMonth">Mês anterior</option>
            <option value="thisYear">Este ano</option>
            <option value="lastYear">Ano anterior</option>
            <option value="custom">Período customizado</option>
          </select>
        </div>

        {/* Busca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="h-4 w-4 inline mr-1" />
            Buscar
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Descrição, categoria, tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Faixa de Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Valor (€)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.amountRange?.min?.toString() || ''}
              onChange={(e) => handleAmountRangeChange('min', e.target.value)}
              placeholder="Min"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              value={filters.amountRange?.max?.toString() || ''}
              onChange={(e) => handleAmountRangeChange('max', e.target.value)}
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Tipo de Despesa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Despesa
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="essentialFilter"
                checked={filters.isEssential === null}
                onChange={() => handleEssentialFilter(null)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm">Todas</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="essentialFilter"
                checked={filters.isEssential === true}
                onChange={() => handleEssentialFilter(true)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm">Essenciais</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="essentialFilter"
                checked={filters.isEssential === false}
                onChange={() => handleEssentialFilter(false)}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm">Supérfluas</span>
            </label>
          </div>
        </div>
      </div>

      {/* Período Customizado */}
      {filters.period === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.dateRange?.start || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value, end: filters.dateRange?.end || '' }
              })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={filters.dateRange?.end || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, start: filters.dateRange?.start || '', end: e.target.value }
              })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Filtro por Categorias */}
      {categories.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Categorias ({filters.categories.length} selecionadas)
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.categories.includes(category.id)
                    ? 'bg-red-100 text-red-800 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resumo dos Filtros Ativos */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.period !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Período: {filters.period}
                <button
                  onClick={() => handlePeriodChange('all')}
                  className="hover:bg-red-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Busca: "{filters.search}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.isEssential !== null && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {filters.isEssential ? 'Essenciais' : 'Supérfluas'}
                <button
                  onClick={() => handleEssentialFilter(null)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};