// src/components/financial/expenses/components/DebtManagement.tsx
import React from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Link, 
  Unlink,
  Plus
} from 'lucide-react';

interface Debt {
  id: string;
  name: string;
  type: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  startDate: string;
  isActive: boolean;
}

interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string;
  isRecurring: boolean;
  debtId?: string;
}

interface DebtExpenseSync {
  debtId: string;
  expenseId: string;
  amount: number;
  isAutomatic: boolean;
  syncedAt: string;
}

interface DebtManagementProps {
  debts: Debt[];
  debtExpenses: ExpenseEntry[];
  syncData: DebtExpenseSync[];
  showBalances: boolean;
  formatCurrency: (value: number) => string;
  onSyncDebt: (debtId: string, expenseId: string) => void;
  onCreateExpenseFromDebt: (debt: Debt) => ExpenseEntry;
}

export const DebtManagement: React.FC<DebtManagementProps> = ({
  debts,
  debtExpenses,
  syncData,
  showBalances,
  formatCurrency,
  onSyncDebt,
  onCreateExpenseFromDebt
}) => {
  const isSynced = (debtId: string) => {
    return syncData.some(sync => sync.debtId === debtId);
  };

  const getSyncedExpense = (debtId: string) => {
    const sync = syncData.find(s => s.debtId === debtId);
    if (!sync) return null;
    return debtExpenses.find(expense => expense.id === sync.expenseId) || null;
  };

  const getDebtTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'credit_card': return '💳';
      case 'loan': return '🏦';
      case 'mortgage': return '🏠';
      case 'personal': return '👤';
      default: return '💼';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sincronização de Dívidas</h3>
          <p className="text-sm text-gray-600">
            Conecte suas dívidas com as despesas para rastreamento automático
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {syncData.length} de {debts.length} dívidas sincronizadas
        </div>
      </div>

      {/* Sync Status Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Link className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Estado da Sincronização</h4>
            <p className="text-sm text-blue-700">
              {syncData.length > 0 
                ? `${syncData.length} dívida(s) sincronizada(s) com despesas`
                : 'Nenhuma dívida sincronizada'
              }
            </p>
          </div>
        </div>
        
        {syncData.length < debts.length && (
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {debts.length - syncData.length} dívida(s) ainda não sincronizada(s)
            </span>
          </div>
        )}
      </div>

      {/* Debt List */}
      <div className="space-y-4">
        {debts.map((debt) => {
          const synced = isSynced(debt.id);
          const syncedExpense = getSyncedExpense(debt.id);

          return (
            <div
              key={debt.id}
              className={`border rounded-lg p-4 transition-colors ${
                synced ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getDebtTypeIcon(debt.type)}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <span>{debt.name}</span>
                      {synced && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">
                        Pagamento: {showBalances ? formatCurrency(debt.monthlyPayment) : '€ •••'}
                      </span>
                      <span className="text-sm text-gray-600">
                        Taxa: {debt.interestRate}% a.a.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {synced ? (
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Sincronizado</span>
                      </div>
                      {syncedExpense && (
                        <div className="text-xs text-gray-500 mt-1">
                          Com: {syncedExpense.description}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => onCreateExpenseFromDebt(debt)}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Criar Despesa</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sync Details */}
              {synced && syncedExpense && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Despesa Associada:</span>
                      <div className="font-medium text-gray-900">{syncedExpense.description}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Valor Sincronizado:</span>
                      <div className="font-medium text-gray-900">
                        {showBalances ? formatCurrency(syncedExpense.amount) : '€ •••'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Tipo:</span>
                      <div className="font-medium text-gray-900">
                        {syncedExpense.isRecurring ? 'Recorrente' : 'Única'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-700">Ativo</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      {debts.length === 0 && (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma dívida encontrada</h3>
          <p className="text-gray-600 mb-4">
            Adicione dívidas na seção de dívidas para sincronizar com despesas
          </p>
        </div>
      )}

      {debts.length > 0 && syncData.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-900">Sincronização Recomendada</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Para melhor controle financeiro, recomendamos sincronizar suas dívidas com despesas. 
                Isso permite rastreamento automático dos pagamentos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
