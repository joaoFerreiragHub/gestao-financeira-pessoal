// src/components/layout/EnhancedSidebar.tsx
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Home, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calculator,
  User,
  LogOut,
  Wallet,
  Eye,
  EyeOff,
  Settings,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  children?: React.ReactNode;
  collapsed?: boolean;
}

interface SubMenuItemProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface User {
  name: string;
  email: string;
  avatar?: string;
  plan?: string;
}

interface FinancialSummary {
  totalBalance: number;
  totalDebts: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

interface EnhancedSidebarProps {
  user?: User;
  financialSummary?: FinancialSummary;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onLogout?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick, 
  hasSubmenu = false, 
  isExpanded = false, 
  children,
  collapsed = false
}) => {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={onClick}
        className={cn(
          "w-full justify-start gap-3 h-11 px-3 text-sm font-medium transition-all duration-200",
          isActive 
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-gray-500")} />
        {!collapsed && (
          <>
            <span className="truncate">{label}</span>
            {hasSubmenu && (
              <ChevronRight 
                className={cn(
                  "h-4 w-4 ml-auto transition-transform duration-200",
                  isExpanded && "rotate-90"
                )} 
              />
            )}
          </>
        )}
      </Button>
      
      {hasSubmenu && isExpanded && !collapsed && (
        <div className="mt-1 ml-8 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const SubMenuItem: React.FC<SubMenuItemProps> = ({ label, isActive = false, onClick }) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "w-full justify-start h-9 px-3 text-sm transition-colors",
        isActive 
          ? "bg-blue-50 text-blue-700 font-medium hover:bg-blue-100" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      {label}
    </Button>
  );
};

export const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  user,
  financialSummary,
  activeSection = 'dashboard',
  onSectionChange,
  onLogout,
  collapsed = false,
  onToggleCollapse
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['contas']);
  const [showBalances, setShowBalances] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { 
      id: 'contas', 
      label: 'Contas', 
      icon: CreditCard, 
      hasSubmenu: true,
      subItems: [
        { id: 'contas-bancarias', label: 'Contas Bancárias' },
        { id: 'cartoes', label: 'Cartões de Crédito' },
        { id: 'investimentos', label: 'Investimentos' }
      ]
    },
    { id: 'rendimentos', label: 'Rendimentos', icon: TrendingUp },
    { id: 'despesas', label: 'Despesas', icon: TrendingDown },
    { id: 'dividas', label: 'Dívidas', icon: Calculator },
    { id: 'projecoes', label: 'Projeções', icon: BarChart3 },
  ];

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const netWorth = financialSummary 
    ? financialSummary.totalBalance - financialSummary.totalDebts 
    : 0;

  return (
    <div className={cn(
      "bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col h-full",
      collapsed ? "w-16" : "w-80"
    )}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FinHub</h1>
                <p className="text-xs text-gray-500">Gestão Financeira</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* User Profile */}
      {!collapsed && user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={user.avatar || '/api/placeholder/40/40'} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            {user.plan && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.plan}
              </span>
            )}
          </div>
          
          {/* Financial Summary */}
          {financialSummary && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Patrimônio Líquido</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalances(!showBalances)}
                  className="h-6 w-6"
                >
                  {showBalances ? 
                    <Eye className="h-4 w-4 text-gray-500" /> : 
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  }
                </Button>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {showBalances ? formatCurrency(netWorth) : '•••••'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            hasSubmenu={item.hasSubmenu}
            isExpanded={expandedMenus.includes(item.id)}
            collapsed={collapsed}
            onClick={() => {
              if (item.hasSubmenu) {
                toggleSubmenu(item.id);
              } else {
                onSectionChange?.(item.id);
              }
            }}
          >
            {item.subItems?.map((subItem) => (
              <SubMenuItem
                key={subItem.id}
                label={subItem.label}
                isActive={activeSection === subItem.id}
                onClick={() => onSectionChange?.(subItem.id)}
              />
            ))}
          </SidebarItem>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
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
  );
};

// Hook personalizado para gerenciar estado da sidebar
export const useSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleCollapse = () => setCollapsed(prev => !prev);

  return {
    collapsed,
    activeSection,
    setActiveSection,
    toggleCollapse,
  };
};

// Layout principal que integra a sidebar
interface MainLayoutProps {
  children: React.ReactNode;
  user?: User;
  financialSummary?: FinancialSummary;
  onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  financialSummary,
  onLogout
}) => {
  const { collapsed, activeSection, setActiveSection, toggleCollapse } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <EnhancedSidebar
        user={user}
        financialSummary={financialSummary}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeSection.replace('-', ' ')}
              </h2>
              <p className="text-sm text-gray-600">
                Gerencie suas finanças de forma inteligente
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </Button>
              <Button>
                Novo Registro
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EnhancedSidebar;