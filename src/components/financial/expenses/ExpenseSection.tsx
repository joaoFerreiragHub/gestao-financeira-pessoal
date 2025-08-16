// Adicionar este import no topo do ficheiro ExpenseSection.tsx
import { ExpenseCategoriesManager } from './ExpenseCategoriesManager';
import { Settings } from 'lucide-react';

// Substituir o array `tabs` existente por este:
const tabs = [
  { 
    id: 'overview' as TabType, 
    label: 'Visão Geral', 
    icon: BarChart3,
    description: 'Resumo das suas despesas'
  },
  { 
    id: 'categories' as TabType, 
    label: 'Categorias', 
    icon: Tag,
    description: 'Gerencie suas categorias de despesas'
  },
  { 
    id: 'categorization' as TabType, 
    label: 'Gestão Avançada', 
    icon: Settings,
    description: 'Sistema avançado de categorização com sincronização de dívidas'
  },
  { 
    id: 'history' as TabType, 
    label: 'Histórico', 
    icon: Calendar,
    description: 'Histórico completo de despesas'
  },
  { 
    id: 'budget' as TabType, 
    label: 'Orçamento', 
    icon: PiggyBank,
    description: 'Controle e análise de orçamento'
  }
];

// No final da função renderActiveSection(), antes do case 'budget', adicionar:
case 'categorization':
  return (
    <ExpenseCategoriesManager 
      showBalances={showBalances}
      onToggleBalances={() => setShowBalances(!showBalances)}
    />
  );

// Também adicionar o tipo 'categorization' no tipo TabType (se não existir):
type TabType = 'overview' | 'categories' | 'categorization' | 'history' | 'budget';