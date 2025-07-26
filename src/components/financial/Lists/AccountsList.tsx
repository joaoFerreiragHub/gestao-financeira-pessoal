import { Trash2 } from 'lucide-react'
import type { Account } from '../../../types/pageContext'
import { formatCurrency } from '../../../utils/financial'

interface AccountsListProps {
  accounts: Account[]
  onRemoveAccount: (id: string) => void
}

export function AccountsList({ accounts, onRemoveAccount }: AccountsListProps) {
  const getAccountTypeLabel = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return 'Conta Corrente'
      case 'savings':
        return 'Poupança'
      case 'investment':
        return 'Investimento'
      default:
        return type
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Minhas Contas</h2>
      
      {accounts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhuma conta cadastrada ainda.</p>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div 
              key={account.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{account.name}</p>
                <p className="text-sm text-gray-600">
                  {getAccountTypeLabel(account.type)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-gray-900">
                  {formatCurrency(account.balance)}
                </span>
                <button
                  onClick={() => onRemoveAccount(account.id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-1"
                  title="Remover conta"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}