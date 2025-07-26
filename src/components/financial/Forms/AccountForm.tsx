import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Account } from '../../../types/pageContext'

interface AccountFormProps {
  onAddAccount: (account: Omit<Account, 'id'>) => void
}

export function AccountForm({ onAddAccount }: AccountFormProps) {
  const [formData, setFormData] = useState<Omit<Account, 'id'>>({
    name: '',
    balance: 0,
    type: 'checking'
  })

  const handleSubmit = () => {
    if (formData.name && formData.balance >= 0) {
      onAddAccount(formData)
      setFormData({ name: '', balance: 0, type: 'checking' })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Adicionar Nova Conta</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nome da conta"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="number"
          placeholder="Saldo inicial"
          value={formData.balance || ''}
          onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="checking">Conta Corrente</option>
          <option value="savings">Poupança</option>
          <option value="investment">Investimento</option>
        </select>
        
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center font-medium"
        >
          <Plus size={18} /> Adicionar
        </button>
      </div>
    </div>
  )
}