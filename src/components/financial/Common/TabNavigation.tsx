import { BarChart3, CreditCard, DollarSign, TrendingDown, AlertTriangle, PiggyBank } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: React.ElementType
}

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'accounts', label: 'Contas', icon: CreditCard },
  { id: 'income', label: 'Rendimentos', icon: DollarSign },
  { id: 'expenses', label: 'Despesas', icon: TrendingDown },
  { id: 'debts', label: 'Dívidas', icon: AlertTriangle },
  { id: 'projections', label: 'Projeções', icon: PiggyBank }
]

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="flex flex-wrap gap-3 justify-center">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
            activeTab === id 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </nav>
  )
}