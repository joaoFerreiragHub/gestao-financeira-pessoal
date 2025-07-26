// src/hooks/useIncomeStorage.ts

import { useCallback } from 'react';
import { IncomeEntry, IncomeSource, UseIncomeStorageReturn } from '../../../../types/income';


const STORAGE_KEYS = {
  SOURCES: 'finhub-income-sources',
  ENTRIES: 'finhub-income-entries',
  BACKUP: 'finhub-income-backup'
} as const;

export const useIncomeStorage = (): UseIncomeStorageReturn => {
  
  const saveData = useCallback((sources: IncomeSource[], entries: IncomeEntry[]) => {
    try {
      // Salvar dados principais
      localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
      
      // Criar backup automático
      const backup = {
        sources,
        entries,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backup));
      
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      
      // Fallback: tentar salvar sem backup se localStorage estiver cheio
      try {
        localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
      } catch (fallbackError) {
        console.error('Erro crítico ao salvar dados:', fallbackError);
        // Aqui poderia implementar um sistema de alertas para o usuário
      }
    }
  }, []);

  const loadData = useCallback((): { sources: IncomeSource[]; entries: IncomeEntry[] } => {
    try {
      const sourcesData = localStorage.getItem(STORAGE_KEYS.SOURCES);
      const entriesData = localStorage.getItem(STORAGE_KEYS.ENTRIES);

      if (sourcesData && entriesData) {
        const sources = JSON.parse(sourcesData);
        const entries = JSON.parse(entriesData);
        
        // Validação básica
        if (Array.isArray(sources) && Array.isArray(entries)) {
          return { sources, entries };
        }
      }

      // Se não há dados ou dados inválidos, tentar backup
      const backupData = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (backupData) {
        const backup = JSON.parse(backupData);
        if (backup.sources && backup.entries) {
          console.log('Dados restaurados do backup');
          return { sources: backup.sources, entries: backup.entries };
        }
      }

      // Se nada funcionar, retornar arrays vazios
      return { sources: [], entries: [] };
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return { sources: [], entries: [] };
    }
  }, []);

  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SOURCES);
      localStorage.removeItem(STORAGE_KEYS.ENTRIES);
      localStorage.removeItem(STORAGE_KEYS.BACKUP);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }, []);

  // Funções auxiliares exportadas para uso direto
  const exportToJSON = useCallback((sources: IncomeSource[], entries: IncomeEntry[]): string => {
    const exportData = {
      sources,
      entries,
      exportDate: new Date().toISOString(),
      version: '1.0',
      appVersion: 'FinHub v1.0'
    };
    return JSON.stringify(exportData, null, 2);
  }, []);

  const importFromJSON = useCallback((jsonString: string): { sources: IncomeSource[]; entries: IncomeEntry[] } | null => {
    try {
      const data = JSON.parse(jsonString);
      
      // Validação do formato
      if (!data.sources || !data.entries || !Array.isArray(data.sources) || !Array.isArray(data.entries)) {
        throw new Error('Formato de dados inválido');
      }

      // Validação básica dos objetos
      const validSources = data.sources.every((source: any) => 
        source.id && source.name && source.category
      );
      
      const validEntries = data.entries.every((entry: any) => 
        entry.id && entry.sourceId && typeof entry.amount === 'number' && entry.date
      );

      if (!validSources || !validEntries) {
        throw new Error('Dados com formato inválido');
      }

      return { sources: data.sources, entries: data.entries };
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return null;
    }
  }, []);

  const getStorageInfo = useCallback(() => {
    try {
      const sourcesSize = new Blob([localStorage.getItem(STORAGE_KEYS.SOURCES) || '']).size;
      const entriesSize = new Blob([localStorage.getItem(STORAGE_KEYS.ENTRIES) || '']).size;
      const backupSize = new Blob([localStorage.getItem(STORAGE_KEYS.BACKUP) || '']).size;
      
      return {
        sourcesSize,
        entriesSize,
        backupSize,
        totalSize: sourcesSize + entriesSize + backupSize,
        itemCount: {
          sources: JSON.parse(localStorage.getItem(STORAGE_KEYS.SOURCES) || '[]').length,
          entries: JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTRIES) || '[]').length
        }
      };
    } catch (error) {
      return {
        sourcesSize: 0,
        entriesSize: 0,
        backupSize: 0,
        totalSize: 0,
        itemCount: { sources: 0, entries: 0 }
      };
    }
  }, []);

  return {
    saveData,
    loadData,
    clearData,
    exportToJSON,
    importFromJSON,
    getStorageInfo
  };
};