// src/components/layout/QuickActionButton.tsx

import { Plus, TrendingUp, CreditCard, Target, PiggyBank } from 'lucide-react'

interface QuickActionButtonProps {
  activeSection: string
  onAction: () => void
}

export function QuickActionButton({ activeSection, onAction }: QuickActionButtonProps) {
  const getActionConfig = (section: string) => {
    const configs = {
      dashboard: {
        label: 'Novo Registo',
        icon: Plus,
        description: 'Adicionar receita rápida'
      },
      income: {
        label: 'Nova Receita',
        icon: TrendingUp,
        description: 'Registar novo rendimento'
      },
      expenses: {
        label: 'Nova Despesa',
        icon: CreditCard,
        description: 'Adicionar novo gasto'
      },
      accounts: {
        label: 'Nova Conta',
        icon: PiggyBank,
        description: 'Adicionar conta bancária'
      },
      debts: {
        label: 'Nova Dívida',
        icon: Target,
        description: 'Registar empréstimo'
      }
    }
    
    return configs[section as keyof typeof configs] || configs.dashboard
  }

  const config = getActionConfig(activeSection)
  const Icon = config.icon

  return (
    <button
      onClick={onAction}
      className="group inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium 
                 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md
                 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      title={config.description}
    >
      <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline">{config.label}</span>
      <span className="sm:hidden">
        <Icon className="h-4 w-4" />
      </span>
    </button>
  )
}