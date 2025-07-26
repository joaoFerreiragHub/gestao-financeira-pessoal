// src/types/income.ts

export interface IncomeSource {
  id: string;
  name: string;
  category: 'salary' | 'freelance' | 'business' | 'investments' | 'other';
  description?: string;
  defaultAmount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeEntry {
  id: string;
  sourceId: string;
  sourceName: string; // Desnormalizado para performance
  amount: number;
  date: string; // YYYY-MM-DD format
  description?: string;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IncomeStats {
  totalThisMonth: number;
  totalLastMonth: number;
  totalThisYear: number;
  totalLastYear: number;
  averageMonthly: number;
  growth: {
    monthly: number;
    yearly: number;
  };
  bySource: {
    sourceId: string;
    sourceName: string;
    total: number;
    percentage: number;
  }[];
}

export interface IncomeFilter {
  period: 'all' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom';
  sources: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  search: string;
  tags?: string[];
}

export type GroupByPeriod = 'day' | 'month' | 'year';

export interface GroupedEntries {
  [key: string]: IncomeEntry[];
}

// Formulário types
export interface IncomeSourceFormData {
  name: string;
  category: IncomeSource['category'];
  description: string;
  defaultAmount: string;
  isActive: boolean;
}

export interface IncomeEntryFormData {
  sourceId: string;
  amount: string;
  date: string;
  description: string;
  isRecurring: boolean;
  frequency: IncomeEntry['frequency'];
  tags: string[];
}

// Props types
export interface IncomeComponentProps {
  showBalances: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface FormProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  editData?: T | null;
}

// Hook return types
export interface UseIncomeDataReturn {
  sources: IncomeSource[];
  entries: IncomeEntry[];
  loading: boolean;
  addSource: (source: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSource: (id: string, updates: Partial<IncomeSource>) => void;
  deleteSource: (id: string) => void;
  addEntry: (entry: Omit<IncomeEntry, 'id' | 'sourceName' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<IncomeEntry>) => void;
  deleteEntry: (id: string) => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

export interface UseIncomeStatsReturn {
  stats: IncomeStats;
  recalculate: () => void;
}

export interface UseIncomeStorageReturn {
  saveData: (sources: IncomeSource[], entries: IncomeEntry[]) => void;
  loadData: () => { sources: IncomeSource[]; entries: IncomeEntry[] };
  clearData: () => void;
  exportToJSON: (sources: IncomeSource[], entries: IncomeEntry[]) => string;
  importFromJSON: (jsonString: string) => { sources: IncomeSource[]; entries: IncomeEntry[] } | null;
  getStorageInfo: () => {
    sourcesSize: number;
    entriesSize: number;
    backupSize: number;
    totalSize: number;
    itemCount: { sources: number; entries: number };
  };
}