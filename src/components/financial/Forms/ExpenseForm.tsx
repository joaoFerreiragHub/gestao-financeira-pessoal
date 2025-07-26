import { useState } from 'react'
import { TrendingDown, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Input } from '../../ui/input'

interface Expense {
  category: string
  description: string
  amount: number
  frequency: 'monthly' | 'yearly'
}

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void
}

const expenseCategories = [
  'Alimentação',
  'Transporte', 
  'Habitação',
  'Saúde',
  'Educação',
  'Entretenimento',
  'Vestuário',
  'Seguros',
  'Comunicações',
  'Outros'
]

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    category: '',
    description: '',
    amount: 0,
    frequency: 'monthly'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.category && formData.description && formData.amount > 0) {
      onAddExpense(formData)
      setFormData({ category: '', description: '', amount: 0, frequency: 'monthly' })
    }
  }

  const frequencyLabels = {
    monthly: 'Mensal',
    yearly: 'Anual'
  }

  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <TrendingDown className="h-5 w-5" />
          Adicionar Despesa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="border-red-200 focus:ring-red-500">
                  <SelectValue placeholder="Selecione categoria" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-description">Descrição</Label>
              <Input
                id="expense-description"
                type="text"
                placeholder="Ex: Supermercado, Combustível"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="border-red-200 focus-visible:ring-red-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Valor (€)</Label>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                min="0.01"
                required
                className="border-red-200 focus-visible:ring-red-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-frequency">Frequência</Label>
              <Select value={formData.frequency} onValueChange={(value: Expense['frequency']) => setFormData({ ...formData, frequency: value })}>
                <SelectTrigger className="border-red-200 focus:ring-red-500">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(frequencyLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}