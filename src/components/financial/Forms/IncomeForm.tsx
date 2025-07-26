import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Income } from '../../../types/pageContext'

interface IncomeFormProps {
  onAddIncome: (income: Omit<Income, 'id'>) => void
}

export function IncomeForm({ onAddIncome }: IncomeFormProps) {
  const [formData, setFormData] = useState<Omit<Income, 'id'>>({
    description: '',
    amount: 0,
    frequency: 'monthly'
  })

  const handleSubmit = () => {
    if (formData.description && formData.amount > 0) {
      onAddIncome(formData)
      setFormData({ description: '', amount: 0, frequency: 'monthly' })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Adicionar Rendimento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Descrição"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <input
          type="number"
          placeholder="Valor"
          value={formData.amount || ''}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Income['frequency'] })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="monthly">Mensal</option>
          <option value="yearly">Anual</option>
        </select>
        
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center font-medium"
        >
          <Plus size={18} /> Adicionar
        </button>
      </div>
    </div>
  )
}