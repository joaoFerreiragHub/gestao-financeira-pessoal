import React, { useState } from 'react'
import { 
  Home, CreditCard, TrendingUp, TrendingDown, Calculator, BarChart3,
  User, Settings, LogOut, Menu, Search, ChevronRight, Eye, EyeOff, Wallet,
  Target, FileText, Building2
} from 'lucide-react'

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  isActive?: boolean
  onClick?: () => void
  hasSubmenu?: boolean
  isExpanded?: boolean
  children?: React.ReactNode
  collapsed?: boolean
  badge?: string | number
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick, 
  hasSubmenu = false, 
  isExpanded = false, 
  children,
  collapsed = false,
  badge
}) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        } ${collapsed ? 'justify-center px-2' : ''}`}
      >
        <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
          <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
          {!collapsed && (
            <>
              <span className="truncate">{label}</span>
              {badge && (
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {badge}
                </span>
              )}
            </>
          )}
        </div>
        
        {hasSubmenu && !collapsed && (
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </button>
      
      {/* Tooltip para modo colapsado */}
      {collapsed && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          {label}
        </div>
      )}
      
      {hasSubmenu && isExpanded && !collapsed && (
        <div className="mt-1 ml-8 space-y-1">
          {children}
        </div>
      )}
    </div>
  )
}

const SubMenuItem: React.FC<{ 
  label: string; 
  isActive?: boolean; 
  onClick?: () => void;
  badge?: string | number;
}> = ({ 
  label, 
  isActive = false, 
  onClick,
  badge
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
        isActive 
          ? 'bg-blue-50 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span>{label}</span>
      {badge && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {badge}
        </span>
      )}
    </button>
  )
}

interface User {
  name: string
  email: string
  avatar: string
  plan: string
}

interface FinancialSummary {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  netWorth: number
}

interface EnhancedSidebarProps {
  user?: User
  financialSummary?: FinancialSummary
  activeSection: string
  onSectionChange?: (section: string) => void
  onLogout?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  user,
  financialSummary,
  activeSection = 'dashboard',
  onSectionChange,
  onLogout,
  collapsed = false,
  onToggleCollapse
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['contas'])
  const [showBalances, setShowBalances] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'accounts', label: 'Contas Bancárias', icon: Building2, badge: '4' },
    { id: 'income', label: 'Rendimentos', icon: TrendingUp, badge: '2' },
    { id: 'expenses', label: 'Despesas', icon: TrendingDown, badge: '5' },
    { id: 'debts', label: 'Dívidas', icon: Calculator, badge: '1' },
    { id: 'goals', label: 'Metas Financeiras', icon: Target, badge: '5' },
    { id: 'projections', label: 'Projeções', icon: BarChart3 },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ]

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const handleMenuClick = (itemId: string, hasSubmenu: boolean = false) => {
    if (hasSubmenu) {
      toggleSubmenu(itemId)
    } else {
      onSectionChange?.(itemId)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  const netWorth = financialSummary 
    ? financialSummary.totalBalance - (financialSummary.netWorth || 0)
    : 0

  return (
    <div className={`bg-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col h-screen ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      
      {/* Header da Sidebar */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FinanceHub</h1>
                <p className="text-xs text-gray-500">Gestão Inteligente</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Perfil do Usuário */}
      {!collapsed && user && (
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={user.avatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {user.plan}
            </span>
          </div>
          
          {/* Resumo Financeiro */}
          {financialSummary && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Patrimônio Líquido</span>
                <button 
                  onClick={() => setShowBalances(!showBalances)}
                  className="p-1 hover:bg-white/50 rounded transition-colors"
                >
                  {showBalances ? 
                    <Eye className="h-4 w-4 text-gray-500" /> : 
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  }
                </button>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {showBalances ? formatCurrency(financialSummary.netWorth) : '€•••••'}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="block">Receitas</span>
                  <span className="font-medium text-green-600">
                    {showBalances ? formatCurrency(financialSummary.monthlyIncome) : '€•••'}
                  </span>
                </div>
                <div>
                  <span className="block">Despesas</span>
                  <span className="font-medium text-red-600">
                    {showBalances ? formatCurrency(financialSummary.monthlyExpenses) : '€•••'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar seções..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems
          .filter(item => 
            !searchQuery || 
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subItems?.some(sub => sub.label.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeSection === item.id}
              hasSubmenu={item.hasSubmenu}
              isExpanded={expandedMenus.includes(item.id)}
              collapsed={collapsed}
              badge={item.badge}
              onClick={() => handleMenuClick(item.id, item.hasSubmenu)}
            >
              {item.subItems?.map((subItem) => (
                <SubMenuItem
                  key={subItem.id}
                  label={subItem.label}
                  isActive={activeSection === subItem.id}
                  badge={subItem.badge}
                  onClick={() => onSectionChange?.(subItem.id)}
                />
              ))}
            </SidebarItem>
          ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
        <SidebarItem
          icon={User}
          label="Perfil"
          isActive={activeSection === 'profile'}
          collapsed={collapsed}
          onClick={() => onSectionChange?.('profile')}
        />
        <SidebarItem
          icon={Settings}
          label="Configurações"
          isActive={activeSection === 'settings'}
          collapsed={collapsed}
          onClick={() => onSectionChange?.('settings')}
        />
        <SidebarItem
          icon={LogOut}
          label="Sair"
          collapsed={collapsed}
          onClick={onLogout}
        />
      </div>
    </div>
  )
}