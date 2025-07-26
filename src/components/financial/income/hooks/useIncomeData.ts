// src/hooks/useIncomeData.ts

import { useState, useEffect } from 'react';
import { IncomeEntry, IncomeSource, UseIncomeDataReturn } from '../../../../types/income';


const STORAGE_KEYS = {
  SOURCES: 'income-sources',
  ENTRIES: 'income-entries'
} as const;

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Dados iniciais de exemplo
const getInitialSources = (): IncomeSource[] => [
  {
    id: '1',
    name: 'Salário Principal',
    category: 'salary',
    description: 'Empresa XYZ',
    defaultAmount: 2500,
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '2',
    name: 'Freelance Design',
    category: 'freelance',
    description: 'Projetos diversos',
    defaultAmount: 500,
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

const getInitialEntries = (): IncomeEntry[] => [
  {
    id: '1',
    sourceId: '1',
    sourceName: 'Salário Principal',
    amount: 2500,
    date: '2024-12-01',
    description: 'Salário dezembro',
    isRecurring: true,
    frequency: 'monthly',
    tags: ['salario', 'mensal'],
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '2',
    sourceId: '2',
    sourceName: 'Freelance Design',
    amount: 800,
    date: '2024-12-15',
    description: 'Projeto website empresa ABC',
    isRecurring: false,
    tags: ['freelance', 'projeto'],
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  },
  {
    id: '3',
    sourceId: '1',
    sourceName: 'Salário Principal',
    amount: 2500,
    date: '2024-11-01',
    description: 'Salário novembro',
    isRecurring: true,
    frequency: 'monthly',
    tags: ['salario', 'mensal'],
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  }
];

export const useIncomeData = (): UseIncomeDataReturn => {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const savedSources = localStorage.getItem(STORAGE_KEYS.SOURCES);
      const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);

      if (savedSources && savedEntries) {
        setSources(JSON.parse(savedSources));
        setEntries(JSON.parse(savedEntries));
      } else {
        // Primeira vez - usar dados de exemplo
        const initialSources = getInitialSources();
        const initialEntries = getInitialEntries();
        setSources(initialSources);
        setEntries(initialEntries);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      // Fallback para dados iniciais
      setSources(getInitialSources());
      setEntries(getInitialEntries());
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar dados automaticamente quando mudam
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
      } catch (error) {
        console.error('Erro ao salvar fontes no localStorage:', error);
      }
    }
  }, [sources, loading]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
      } catch (error) {
        console.error('Erro ao salvar entradas no localStorage:', error);
      }
    }
  }, [entries, loading]);

  // Funções de gestão de fontes
  const addSource = (sourceData: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSource: IncomeSource = {
      ...sourceData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setSources(prev => [...prev, newSource]);
  };

  const updateSource = (id: string, updates: Partial<IncomeSource>) => {
    setSources(prev => prev.map(source => 
      source.id === id 
        ? { ...source, ...updates, updatedAt: getCurrentTimestamp() }
        : source
    ));

    // Atualizar sourceName nas entradas se o nome mudou
    if (updates.name) {
      setEntries(prev => prev.map(entry =>
        entry.sourceId === id
          ? { ...entry, sourceName: updates.name!, updatedAt: getCurrentTimestamp() }
          : entry
      ));
    }
  };

  const deleteSource = (id: string) => {
    setSources(prev => prev.filter(source => source.id !== id));
    // Remover também todas as entradas desta fonte
    setEntries(prev => prev.filter(entry => entry.sourceId !== id));
  };

  // Funções de gestão de entradas
  const addEntry = (entryData: Omit<IncomeEntry, 'id' | 'sourceName' | 'createdAt' | 'updatedAt'>) => {
    const source = sources.find(s => s.id === entryData.sourceId);
    if (!source) {
      console.error('Fonte não encontrada:', entryData.sourceId);
      return;
    }

    const newEntry: IncomeEntry = {
      ...entryData,
      id: generateId(),
      sourceName: source.name,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const updateEntry = (id: string, updates: Partial<IncomeEntry>) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, ...updates, updatedAt: getCurrentTimestamp() };
        
        // Se mudou a fonte, atualizar o sourceName
        if (updates.sourceId && updates.sourceId !== entry.sourceId) {
          const newSource = sources.find(s => s.id === updates.sourceId);
          if (newSource) {
            updatedEntry.sourceName = newSource.name;
          }
        }
        
        return updatedEntry;
      }
      return entry;
    }));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Funções utilitárias
  const clearAllData = () => {
    setSources([]);
    setEntries([]);
    localStorage.removeItem(STORAGE_KEYS.SOURCES);
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
  };

  const exportData = (): string => {
    const data = {
      sources,
      entries,
      exportDate: getCurrentTimestamp(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // Validação básica
      if (!data.sources || !data.entries || !Array.isArray(data.sources) || !Array.isArray(data.entries)) {
        throw new Error('Formato de dados inválido');
      }

      setSources(data.sources);
      setEntries(data.entries);
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  };

  return {
    sources,
    entries,
    loading,
    addSource,
    updateSource,
    deleteSource,
    addEntry,
    updateEntry,
    deleteEntry,
    clearAllData,
    exportData,
    importData
  };
};