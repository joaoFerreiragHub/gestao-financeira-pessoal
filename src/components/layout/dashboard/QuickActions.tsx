import React from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calculator, 
  Target, 
  BarChart3,
  CreditCard,
  PiggyBank,
  FileText,
  Settings
} from 'lucide-react'

interface QuickActionProps {
  icon: React.ElementType
  label: string
  description: string
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'indigo'
  onClick: () => void
  disabled?: boolean
  badge?: string | number
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
  red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
  orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
}

function QuickAction({ 
  icon: Icon, 
  label, 
  description, 
  color, 
  onClick, 
  disabled = false,
  badge 
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {label}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        
        {badge && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {badge}
          </span>
        )}
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
    </button>
  )
}

interface QuickActionsProps {
  onNavigate: (section: string) => void
  financialData?: {
    accountsCount: number
    incomesCount: number
    expensesCount: number
    debtsCount: number
  }
}

export function QuickActions({ onNavigate, financialData }: QuickActionsProps) {
  const actions = [
    {
      icon: TrendingUp,
      label: 'Adicionar Rendimento',
      description: 'Registar nova fonte de renda',
      color: 'green' as const,
      onClick: () => onNavigate('income'),
      badge: financialData?.incomesCount
    },
    {
      icon: TrendingDown,
      label: 'Registar Despesa',
      description: 'Adicionar novo gasto',
      color: 'red' as const,
      onClick: () => onNavigate('expenses'),
      badge: financialData?.expensesCount
    },
    {
      icon: Wallet,
      label: 'Nova Conta',
      description: 'Adicionar conta bancária',
      color: 'blue' as const,
      onClick: () => onNavigate('accounts'),
      badge: financialData?.accountsCount
    },
    {
      icon: Target,
      label: 'Definir Meta',
      description: 'Criar objetivo financeiro',
      color: 'purple' as const,
      onClick: () => onNavigate('goals')
    },
    {
      icon: Calculator,
      label: 'Gerir Dívidas',
      description: 'Controlar empréstimos',
      color: 'orange' as const,
      onClick: () => onNavigate('debts'),
      badge: financialData?.debtsCount
    },
    {
      icon: BarChart3,
      label: 'Ver Relatórios',
      description: 'Análises detalhadas',
      color: 'indigo' as const,
      onClick: () => onNavigate('reports')
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Ações Rápidas</h2>
          <p className="text-gray-600 text-sm mt-1">
            Acesso direto às funcionalidades mais utilizadas
          </p>
        </div>
        
        <button
          onClick={() => onNavigate('settings')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Personalizar ações"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Grid de Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>

      {/* Ações Adicionais */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Outras Ações</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('import')}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-sm"
          >
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Importar</span>
          </button>
          
          <button
            onClick={() => onNavigate('export')}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-sm"
          >
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Exportar</span>
          </button>
          
          <button
            onClick={() => onNavigate('budget')}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-sm"
          >
            <PiggyBank className="h-4 w-4 text-gray-500" />
                       <span className="text-gray-700">Orçamentos</span>
          </button>
          
          <button
            onClick={() => onNavigate('cards')}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-sm"
          >
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Cartões</span>
          </button>
        </div>
      </div>
    </div>
  )
}