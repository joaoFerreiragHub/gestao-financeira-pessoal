// src/components/income/IncomeSection.tsx

import React, { useState, useMemo } from 'react';
import { BarChart3, DollarSign, Calendar, Plus, Eye, EyeOff } from 'lucide-react';

// Hooks

// Componentes
import { IncomeStatsCard } from './IncomeStatsCard';
import { IncomeSourceManager } from './IncomeSourceManager';
import { IncomeHistory } from './IncomeHistory';
import { IncomeFilters } from './IncomeFilters';
import { IncomeSourceForm } from './IncomeSourceForm';
import { IncomeEntryForm } from './IncomeEntryForm';

// Tipos

import { useIncomeData } from './hooks/useIncomeData';
import { useIncomeStats } from './hooks/useIncomeStats';
import { IncomeEntry, IncomeFilter, IncomeSource } from '../../../types/income';

interface IncomeSectionProps {
  showBalances: boolean;
  onToggleBalances?: () => void;
}

type TabType = 'overview' | 'sources' | 'history';

export const IncomeSection: React.FC<IncomeSectionProps> = ({ 
  showBalances, 
  onToggleBalances 
}) => {
  // Estados com tipagem correta
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showSourceForm, setShowSourceForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingSource, setEditingSource] = useState<IncomeSource | null>(null);
  const [editingEntry, setEditingEntry] = useState<IncomeEntry | null>(null);
const [filters, setFilters] = useState<IncomeFilter>({
    period: 'all',
    sources: [],
    search: '',
  });

  // Hooks de dados
  const {
    sources,
    entries,
    loading,
    addSource,
    updateSource,
    deleteSource,
    addEntry,
    updateEntry,
    deleteEntry,
    exportData
  } = useIncomeData();

  const { stats } = useIncomeStats(entries, sources);

  // Filtrar entradas baseado nos filtros
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Filtro por período
      if (filters.period !== 'all') {
        const entryDate = new Date(entry.date);
        const now = new Date();
        
        switch (filters.period) {
          case 'thisMonth': {
            if (entryDate.getMonth() !== now.getMonth() || entryDate.getFullYear() !== now.getFullYear()) {
              return false;
            }
            break;
          }
          case 'lastMonth': {
            const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
            const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
            if (entryDate.getMonth() !== lastMonth || entryDate.getFullYear() !== lastMonthYear) {
              return false;
            }
            break;
          }
          case 'thisYear': {
            if (entryDate.getFullYear() !== now.getFullYear()) {
              return false;
            }
            break;
          }
          case 'lastYear': {
            if (entryDate.getFullYear() !== now.getFullYear() - 1) {
              return false;
            }
            break;
          }
          case 'custom': {
            if (filters.dateRange) {
              const entryTime = entryDate.getTime();
              const startTime = filters.dateRange.start ? new Date(filters.dateRange.start).getTime() : 0;
              const endTime = filters.dateRange.end ? new Date(filters.dateRange.end).getTime() : Date.now();
              if (entryTime < startTime || entryTime > endTime) {
                return false;
              }
            }
            break;
          }
        }
      }

      // Filtro por fontes
      if (filters.sources.length > 0 && !filters.sources.includes(entry.sourceId)) {
        return false;
      }

      // Filtro por busca
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          entry.sourceName,
          entry.description || '',
          ...(entry.tags || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Filtro por valor
      if (filters.amountRange) {
        if (filters.amountRange.min && entry.amount < filters.amountRange.min) {
          return false;
        }
        if (filters.amountRange.max && entry.amount > filters.amountRange.max) {
          return false;
        }
      }

      // Filtro por tags
      if (filters.tags && filters.tags.length > 0) {
        const entryTags = entry.tags || [];
        const hasMatchingTag = filters.tags.some((filterTag: string) => 
          entryTags.some((entryTag: string) => 
            entryTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });
  }, [entries, filters]);

  // Handlers com tipagem correta
  const handleSourceFormSubmit = (data: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSource) {
      updateSource(editingSource.id, data);
    } else {
      addSource(data);
    }
    setShowSourceForm(false);
    setEditingSource(null);
  };

  const handleEntryFormSubmit = (data: Omit<IncomeEntry, 'id' | 'sourceName' | 'createdAt' | 'updatedAt'>) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, data);
    } else {
      addEntry(data);
    }
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  const handleEditSource = (source: IncomeSource) => {
    setEditingSource(source);
    setShowSourceForm(true);
  };

  const handleEditEntry = (entry: IncomeEntry) => {
    setEditingEntry(entry);
    setShowEntryForm(true);
  };

  const handleExport = () => {
    const dataStr = exportData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rendimentos-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Configuração das tabs
  const tabs = [
    { 
      id: 'overview' as TabType, 
      label: 'Visão Geral', 
      icon: BarChart3,
      description: 'Resumo e estatísticas gerais'
    },
    { 
      id: 'sources' as TabType, 
      label: 'Fontes', 
      icon: DollarSign,
      description: 'Gerencie suas fontes de renda'
    },
    { 
      id: 'history' as TabType, 
      label: 'Histórico', 
      icon: Calendar,
      description: 'Histórico completo de rendimentos'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Rendimentos</h2>
          <p className="text-gray-600">
            Controle e acompanhe todos os seus rendimentos de forma organizada
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onToggleBalances && (
            <button
              onClick={onToggleBalances}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={showBalances ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {showBalances ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          )}
          <button
            onClick={() => setShowSourceForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Fonte
          </button>
          <button
            onClick={() => setShowEntryForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Rendimento
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <IncomeStatsCard stats={stats} showValues={showBalances} />

      {/* Navegação por Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filtros */}
      <IncomeFilters
        filters={filters}
        sources={sources}
        onFiltersChange={setFilters}
        onExport={handleExport}
        totalEntries={entries.length}
        filteredEntries={filteredEntries.length}
      />

      {/* Conteúdo das Tabs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Evolução */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Evolução Mensal</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Gráfico em desenvolvimento</p>
                  <p className="text-gray-400 text-xs">Mostrará evolução dos rendimentos</p>
                </div>
              </div>
            </div>

            {/* Distribuição por Fonte */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribuição por Fonte</h3>
              <div className="space-y-3">
                {stats.bySource.slice(0, 5).map((sourceData, index) => (
                  <div key={sourceData.sourceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${['blue', 'green', 'purple', 'orange', 'red'][index]}-500`}></div>
                      <span className="font-medium text-gray-900">{sourceData.sourceName}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {showBalances ? new Intl.NumberFormat('pt-PT', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(sourceData.total) : '€•••••'}
                      </p>
                      <p className="text-sm text-gray-500">{sourceData.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
                {stats.bySource.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum rendimento registrado este ano
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Resumo Rápido */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Resumo Rápido</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{sources.length}</p>
                <p className="text-sm text-gray-600">Fontes Ativas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{entries.length}</p>
                <p className="text-sm text-gray-600">Registros Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{filteredEntries.length}</p>
                <p className="text-sm text-gray-600">Filtrados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {stats.growth.monthly >= 0 ? '+' : ''}{stats.growth.monthly.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Crescimento</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sources' && (
        <IncomeSourceManager
          sources={sources}
          entries={entries}
          showBalances={showBalances}
          onAddSource={addSource}
          onUpdateSource={updateSource}
          onDeleteSource={deleteSource}
        />
      )}

      {activeTab === 'history' && (
        <IncomeHistory
          entries={filteredEntries}
          sources={sources}
          showBalances={showBalances}
          onEditEntry={handleEditEntry}
          onDeleteEntry={deleteEntry}
        />
      )}

      {/* Modais */}
      <IncomeSourceForm
        isOpen={showSourceForm}
        onClose={() => {
          setShowSourceForm(false);
          setEditingSource(null);
        }}
        onSubmit={handleSourceFormSubmit}
        editData={editingSource}
      />

      <IncomeEntryForm
        isOpen={showEntryForm}
        onClose={() => {
          setShowEntryForm(false);
          setEditingEntry(null);
        }}
        onSubmit={handleEntryFormSubmit}
        editData={editingEntry}
        sources={sources}
      />
    </div>
  );
};