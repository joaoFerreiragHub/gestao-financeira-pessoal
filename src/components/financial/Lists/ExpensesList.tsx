import { Trash2 } from 'lucide-react'
import type { Expense } from '../../../types/pageContext'
import { formatCurrency } from '../../../utils/financial'

interface ExpensesListProps {
  expenses: Expense[]
  onRemoveExpense: (id: string) => void
}

export function ExpensesList({ expenses, onRemoveExpense }: ExpensesListProps) {
  const getFrequencyLabel = (frequency: Expense['frequency']) => {
    return frequency === 'monthly' ? 'Mensal' : 'Anual'
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Minhas Despesas</h2>
      
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhuma despesa cadastrada ainda.</p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div 
              key={expense.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{expense.description}</p>
                <p className="text-sm text-gray-600">
                  {expense.category} • {getFrequencyLabel(expense.frequency)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-red-600">
                  {formatCurrency(expense.amount)}
                </span>
                <button
                  onClick={() => onRemoveExpense(expense.id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-1"
                  title="Remover despesa"
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