import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Plus, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Building2,
  Wallet,
  PiggyBank,
  Target,
  Calendar,
  Download,
  Upload
} from 'lucide-react';

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

// Types
interface BankAccount {
  id: string;
  name: string;
  bank: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  currency: string;
  accountNumber: string;
  isActive: boolean;
  lastSync: string;
  interestRate?: number;
  creditLimit?: number;
  icon?: string;
}

interface Transaction {
  id: string;
  accountId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  date: string;
  balance: number;
}

interface AccountSectionProps {
  showBalances: boolean;
  onToggleBalances?: () => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  showBalances,
  onToggleBalances
}) => {
  // Sample data - in real app this would come from hooks/context
  const [accounts] = useState<BankAccount[]>([
    {
      id: '1',
      name: 'Conta Principal',
      bank: 'Banco Santander',
      type: 'checking',
      balance: 3250.75,
      currency: 'EUR',
      accountNumber: '**** 1234',
      isActive: true,
      lastSync: '2025-01-09T10:30:00Z',
      icon: '🏛️'
    },
    {
      id: '2',
      name: 'Poupança',
      bank: 'Caixa Geral de Depósitos',
      type: 'savings',
      balance: 15750.00,
      currency: 'EUR',
      accountNumber: '**** 5678',
      isActive: true,
      lastSync: '2025-01-09T10:25:00Z',
      interestRate: 2.5,
      icon: '🐷'
    },
    {
      id: '3',
      name: 'Investimentos',
      bank: 'ActivoBank',
      type: 'investment',
      balance: 8420.30,
      currency: 'EUR',
      accountNumber: '**** 9101',
      isActive: true,
      lastSync: '2025-01-09T09:15:00Z',
      icon: '📈'
    },
    {
      id: '4',
      name: 'Cartão de Crédito',
      bank: 'Banco BPI',
      type: 'credit',
      balance: -567.25,
      currency: 'EUR',
      accountNumber: '**** 1122',
      isActive: true,
      lastSync: '2025-01-09T10:35:00Z',
      creditLimit: 2500,
      icon: '💳'
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      accountId: '1',
      type: 'income',
      amount: 2800,
      description: 'Salário Mensal',
      category: 'Salário',
      date: '2025-01-08',
      balance: 3250.75
    },
    {
      id: '2',
      accountId: '1',
      type: 'expense',
      amount: -650,
      description: 'Renda do Apartamento',
      category: 'Habitação',
      date: '2025-01-07',
      balance: 450.75
    },
    {
      id: '3',
      accountId: '2',
      type: 'transfer',
      amount: 500,
      description: 'Transferência da Conta Principal',
      category: 'Poupança',
      date: '2025-01-06',
      balance: 15750.00
    },
    {
      id: '4',
      accountId: '3',
      type: 'income',
      amount: 125.30,
      description: 'Dividendos',
      category: 'Investimentos',
      date: '2025-01-05',
      balance: 8420.30
    },
    {
      id: '5',
      accountId: '4',
      type: 'expense',
      amount: -87.50,
      description: 'Compras Online',
      category: 'Compras',
      date: '2025-01-04',
      balance: -567.25
    }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'transactions'>('overview');

  // Calculations
  const totalAssets = useMemo(() => {
    return accounts
      .filter(acc => acc.type !== 'credit')
      .reduce((sum, acc) => sum + Math.max(0, acc.balance), 0);
  }, [accounts]);

  const totalLiabilities = useMemo(() => {
    return accounts
      .filter(acc => acc.type === 'credit')
      .reduce((sum, acc) => sum + Math.abs(Math.min(0, acc.balance)), 0);
  }, [accounts]);

  const netWorth = totalAssets - totalLiabilities;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getAccountIcon = (type: BankAccount['type']) => {
    switch (type) {
      case 'checking': return <Building2 className="h-5 w-5" />;
      case 'savings': return <PiggyBank className="h-5 w-5" />;
      case 'investment': return <TrendingUp className="h-5 w-5" />;
      case 'credit': return <CreditCard className="h-5 w-5" />;
      default: return <Wallet className="h-5 w-5" />;
    }
  };

  const getAccountTypeLabel = (type: BankAccount['type']) => {
    switch (type) {
      case 'checking': return 'Conta Corrente';
      case 'savings': return 'Conta Poupança';
      case 'investment': return 'Investimentos';
      case 'credit': return 'Cartão de Crédito';
      default: return type;
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'expense': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case 'transfer': return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      default: return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Contas</h2>
          <p className="text-gray-600">
            Controle todas as suas contas bancárias e transações
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onToggleBalances && (
            <Button 
              variant="outline"
              size="sm"
              onClick={onToggleBalances}
            >
              {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showBalances ? 'Ocultar' : 'Mostrar'} Valores
            </Button>
          )}
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-800">Total de Ativos</CardTitle>
            <CardDescription className="text-blue-600">Contas e investimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {showBalances ? formatCurrency(totalAssets) : '€ •••••'}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+2.3% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-red-800">Passivos</CardTitle>
            <CardDescription className="text-red-600">Cartões e dívidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">
              {showBalances ? formatCurrency(totalLiabilities) : '€ •••••'}
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm text-red-600">-5.1% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800">Patrimônio Líquido</CardTitle>
            <CardDescription className="text-green-600">Ativos - Passivos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {showBalances ? formatCurrency(netWorth) : '€ •••••'}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+4.7% este mês</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Wallet },
            { id: 'accounts', label: 'Contas', icon: Building2 },
            { id: 'transactions', label: 'Transações', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Accounts Quick View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumo das Contas</CardTitle>
                <CardDescription>Visão geral de todas as contas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{account.name}</h3>
                          <Badge variant={account.isActive ? 'default' : 'secondary'}>
                            {account.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{account.bank} • {account.accountNumber}</p>
                        <p className="text-xs text-gray-500">{getAccountTypeLabel(account.type)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {showBalances ? formatCurrency(account.balance) : '€ •••••'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Sync: {new Date(account.lastSync).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Últimas movimentações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {showBalances ? formatCurrency(Math.abs(transaction.amount)) : '€ •••'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <CardDescription>{account.bank}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={account.isActive ? 'default' : 'secondary'}>
                    {account.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Saldo Atual</p>
                  <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {showBalances ? formatCurrency(account.balance) : '€ •••••'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">{getAccountTypeLabel(account.type)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conta:</span>
                    <span className="font-medium">{account.accountNumber}</span>
                  </div>
                  {account.interestRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxa de Juros:</span>
                      <span className="font-medium text-green-600">{account.interestRate}%</span>
                    </div>
                  )}
                  {account.creditLimit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Limite:</span>
                      <span className="font-medium">{formatCurrency(account.creditLimit)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Histórico
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'transactions' && (
        <Card>
          <CardHeader>
            <CardTitle>Todas as Transações</CardTitle>
            <CardDescription>Histórico completo de movimentações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const account = accounts.find(acc => acc.id === transaction.accountId);
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                        <p className="text-sm text-gray-600">{account?.name} • {transaction.category}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount >= 0 ? '+' : ''}{showBalances ? formatCurrency(transaction.amount) : '€ •••••'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Saldo: {showBalances ? formatCurrency(transaction.balance) : '€ •••••'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
