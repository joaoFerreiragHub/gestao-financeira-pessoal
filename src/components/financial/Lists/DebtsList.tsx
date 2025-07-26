import { Trash2 } from 'lucide-react'
import type { Debt } from '../../../types/pageContext'
import { formatCurrency } from '../../../utils/financial'

interface DebtsListProps {
  debts: Debt[]
  onRemoveDebt: (id: string) => void
}

export function DebtsList({ debts, onRemoveDebt }: DebtsListProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Minhas Dívidas</h2>
      
      {debts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhuma dívida cadastrada ainda.</p>
      ) : (
        <div className="space-y-4">
          {debts.map((debt) => (
            <div 
              key={debt.id} 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-gray-900">{debt.description}</p>
                <button
                  onClick={() => onRemoveDebt(debt.id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-1"
                  title="Remover dívida"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total: </span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(debt.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Taxa: </span>
                  <span className="font-bold">
                    {debt.interestRate}% ao ano
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Pagamento Mensal: </span>
                  <span className="font-bold">
                    {formatCurrency(debt.monthlyPayment)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}