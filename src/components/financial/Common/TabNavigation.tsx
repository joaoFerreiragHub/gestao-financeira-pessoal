import { BarChart3, CreditCard, DollarSign, TrendingDown, AlertTriangle, PiggyBank } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs'

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
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger 
              key={id} 
              value={id}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}