// src/components/financial/debts/DebtHistory.tsx

import React, { useState, useMemo } from 'react';
import { Edit3, Trash2, Calendar, CreditCard, AlertTriangle, CheckCircle, Clock, Percent, Tag } from 'lucide-react';
import { DebtEntry, DebtCategory } from '../../../types/debts';

interface DebtHistoryProps {
  debts: DebtEntry[];
  categories: DebtCategory[];
  showBalances: boolean;
  onEditDebt: (debt: DebtEntry) => void;
  onDeleteDebt: (debtId: string) => void;
  formatCurrency: (amount: number) => string;
}

type SortField = 'dueDate' | 'currentBalance' | 'monthlyPayment' | 'interestRate' | 'creditorName';
type SortDirection = 'asc' | 'desc';

export const DebtHistory: React.FC<DebtHistoryProps> = ({
  debts,
  categories,
  showBalances,
  onEditDebt,
  onDeleteDebt,
  formatCurrency,
}) => {
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedDebt, setSelectedDebt] = useState<string | null>(null);

  // Ordenar dívidas
  const sortedDebts = useMemo(() => {
    return [...debts].sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case 'dueDate':
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case 'currentBalance':
          aValue = a.currentBalance;
          bValue = b.currentBalance;
          break;
        case 'monthlyPayment':
          aValue = a.monthlyPayment;
          bValue = b.monthlyPayment;
          break;
        case 'interestRate':
          aValue = a.interestRate;
          bValue = b.interestRate;
          break;
        case 'creditorName':
          aValue = a.creditorName.toLowerCase();
          bValue = b.creditorName.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [debts, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteDebt = (debt: DebtEntry) => {
    const confirmed = window.confirm(
      `Tem a certeza que quer eliminar a dívida "${debt.creditorName}"? Esta ação não pode ser desfeita.`
    );
    if (confirmed) {
      onDeleteDebt(debt.id);
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatus = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return { status: 'overdue', color: 'text-red-600', bg: 'bg-red-50', text: 'Em atraso' };
    if (days <= 7) return { status: 'due-soon', color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Vence em breve' };
    if (days <= 30) return { status: 'due-month', color: 'text-blue-600', bg: 'bg-blue-50', text: 'Vence este mês' };
    return { status: 'future', color: 'text-green-600', bg: 'bg-green-50', text: 'No prazo' };
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return '';
    }
  };

  const getDebtTypeText = (debtType: string) => {
    switch (debtType) {
      case 'installment': return 'Prestações';
      case 'revolving': return 'Rotativo';
      case 'fixed': return 'Fixo';
      default: return debtType;
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  // Helper para formatar valor com fallback para campos opcionais
  const formatOptionalCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return showBalances ? formatCurrency(amount) : '€•••••';
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <span className="text-gray-400">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  if (debts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma dívida encontrada</h3>
        <p className="text-gray-600">
          Comece por adicionar uma nova dívida para começar o controlo financeiro.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Tabela Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria/Credor
              </th>
              <SortHeader field="currentBalance">Saldo Atual</SortHeader>
              <SortHeader field="monthlyPayment">Pagamento Mensal</SortHeader>
              <SortHeader field="interestRate">Taxa</SortHeader>
              <SortHeader field="dueDate">Vencimento</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDebts.map((debt) => {
              const category = getCategoryInfo(debt.categoryId);
              const dueStatus = getDueDateStatus(debt.dueDate);
              const daysUntilDue = getDaysUntilDue(debt.dueDate);
              
              return (
                <tr key={debt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {category && (
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                          <span className="text-sm">{category.icon}</span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {debt.creditorName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category?.name || 'Sem categoria'}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {getPriorityIcon(debt.priority)}
                          <span className="text-xs text-gray-500">
                            {getPriorityText(debt.priority)}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {getDebtTypeText(debt.debtType)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-red-600">
                      {showBalances ? formatCurrency(debt.currentBalance) : '€•••••'}
                    </div>
                    <div className="text-xs text-gray-500">
                      de {showBalances ? formatCurrency(debt.originalAmount) : '€•••••'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {showBalances ? formatCurrency(debt.monthlyPayment) : '€•••••'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {formatOptionalCurrency(debt.minimumPayment)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Percent className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {debt.interestRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(debt.dueDate).toLocaleDateString('pt-PT')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {daysUntilDue >= 0 ? `${daysUntilDue} dias` : `${Math.abs(daysUntilDue)} dias atraso`}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dueStatus.color} ${dueStatus.bg}`}>
                      {dueStatus.text}
                    </div>
                    <div className="flex items-center mt-1">
                      {debt.isActive ? (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                          <span className="text-xs text-green-600">Ativa</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                          <span className="text-xs text-gray-500">Quitada</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditDebt(debt)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar dívida"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDebt(debt)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar dívida"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedDebts.map((debt) => {
          const category = getCategoryInfo(debt.categoryId);
          const dueStatus = getDueDateStatus(debt.dueDate);
          const daysUntilDue = getDaysUntilDue(debt.dueDate);
          const isExpanded = selectedDebt === debt.id;
          
          return (
            <div key={debt.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header do Card */}
              <div 
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedDebt(isExpanded ? null : debt.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {category && (
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-white rounded-lg">
                        <span className="text-sm">{category.icon}</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{debt.creditorName}</h4>
                      <p className="text-sm text-gray-500">{category?.name || 'Sem categoria'}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-red-600">
                      {showBalances ? formatCurrency(debt.currentBalance) : '€•••••'}
                    </p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      dueStatus.color} ${dueStatus.bg}`}>
                      {dueStatus.text}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhes do Card (Expandível) */}
              {isExpanded && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Valor Original</p>
                      <p className="font-medium">
                        {showBalances ? formatCurrency(debt.originalAmount) : '€•••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Pagamento Mensal</p>
                      <p className="font-medium">
                        {showBalances ? formatCurrency(debt.monthlyPayment) : '€•••••'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Pagamento Mínimo</p>
                      <p className="font-medium">
                        {formatOptionalCurrency(debt.minimumPayment)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Taxa de Juro</p>
                      <p className="font-medium">{debt.interestRate.toFixed(1)}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Data de Vencimento</p>
                      <p className="font-medium">
                        {new Date(debt.dueDate).toLocaleDateString('pt-PT')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {daysUntilDue >= 0 ? `${daysUntilDue} dias` : `${Math.abs(daysUntilDue)} dias atraso`}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="font-medium">{getDebtTypeText(debt.debtType)}</p>
                    </div>
                  </div>

                  {/* Prioridade e Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(debt.priority)}
                      <span className="text-sm text-gray-600">
                        Prioridade {getPriorityText(debt.priority)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {debt.isActive ? (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-green-600">Ativa</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm text-gray-500">Quitada</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Percentagem Paga */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progresso de Pagamento</span>
                      <span>
                        {((debt.originalAmount - debt.currentBalance) / debt.originalAmount * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max(0, Math.min(100, (debt.originalAmount - debt.currentBalance) / debt.originalAmount * 100))}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  {debt.tags && debt.tags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Etiquetas:</p>
                      <div className="flex flex-wrap gap-1">
                        {debt.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Descrição */}
                  {debt.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Descrição:</p>
                      <p className="text-sm text-gray-700">{debt.description}</p>
                    </div>
                  )}

                  {/* Garantia */}
                  {debt.collateral && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Garantia:</p>
                      <p className="text-sm text-gray-700">{debt.collateral}</p>
                    </div>
                  )}

                  {/* Métricas Calculadas */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">📊 Métricas</h5>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Valor pago:</span>
                        <p className="font-medium text-green-600">
                          {showBalances ? formatCurrency(debt.originalAmount - debt.currentBalance) : '€•••••'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Juros mensais:</span>
                        <p className="font-medium text-red-600">
                          {showBalances ? formatCurrency(debt.currentBalance * debt.interestRate / 100 / 12) : '€•••••'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tempo estimado:</span>
                        <p className="font-medium text-blue-600">
                          {Math.ceil(debt.currentBalance / debt.monthlyPayment)} meses
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Percentagem paga:</span>
                        <p className="font-medium text-purple-600">
                          {((debt.originalAmount - debt.currentBalance) / debt.originalAmount * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => onEditDebt(debt)}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteDebt(debt)}
                      className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer com Resumo */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Total de Dívidas</p>
            <p className="text-lg font-semibold text-gray-900">{debts.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dívidas Ativas</p>
            <p className="text-lg font-semibold text-green-600">
              {debts.filter(d => d.isActive).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vencem em 7 dias</p>
            <p className="text-lg font-semibold text-yellow-600">
              {debts.filter(d => {
                const days = getDaysUntilDue(d.dueDate);
                return days >= 0 && days <= 7;
              }).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Em Atraso</p>
            <p className="text-lg font-semibold text-red-600">
              {debts.filter(d => getDaysUntilDue(d.dueDate) < 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};