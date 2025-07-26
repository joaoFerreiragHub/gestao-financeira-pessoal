import { Trash2 } from 'lucide-react'
import type { Income } from '../../../types/pageContext'
import { formatCurrency } from '../../../utils/financial'

interface IncomesListProps {
  incomes: Income[]
  onRemoveIncome: (id: string) => void
}

export function IncomesList({ incomes, onRemoveIncome }: IncomesListProps) {
  const getFrequencyLabel = (frequency: Income['frequency']) => {
    return frequency === 'monthly' ? 'Mensal' : 'Anual'
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Meus Rendimentos</h2>
      
      {incomes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum rendimento cadastrado ainda.</p>
      ) : (
        <div className="space-y-3">
          {incomes.map((income) => (
            <div 
              key={income.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{income.description}</p>
                <p className="text-sm text-gray-600">
                  {getFrequencyLabel(income.frequency)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-green-600">
                  {formatCurrency(income.amount)}
                </span>
                <button
                  onClick={() => onRemoveIncome(income.id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-1"
                  title="Remover rendimento"
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