import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Debt } from '../../../types/pageContext'

interface DebtFormProps {
  onAddDebt: (debt: Omit<Debt, 'id'>) => void
}

export function DebtForm({ onAddDebt }: DebtFormProps) {
  const [formData, setFormData] = useState<Omit<Debt, 'id'>>({
    description: '',
    amount: 0,
    interestRate: 0,
    monthlyPayment: 0
  })

  const handleSubmit = () => {
    if (formData.description && formData.amount > 0 && formData.monthlyPayment > 0) {
      onAddDebt(formData)
      setFormData({ description: '', amount: 0, interestRate: 0, monthlyPayment: 0 })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Adicionar Dívida</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Descrição"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        
        <input
          type="number"
          placeholder="Valor Total"
          value={formData.amount || ''}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        
        <input
          type="number"
          placeholder="Taxa de Juros (% anual)"
          value={formData.interestRate || ''}
          onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        
        <input
          type="number"
          placeholder="Pagamento Mensal"
          value={formData.monthlyPayment || ''}
          onChange={(e) => setFormData({ ...formData, monthlyPayment: Number(e.target.value) })}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        
        <button
          onClick={handleSubmit}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 justify-center font-medium"
        >
          <Plus size={18} /> Adicionar
        </button>
      </div>
    </div>
  )
}