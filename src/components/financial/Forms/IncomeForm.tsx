import { useState } from 'react'
import { DollarSign, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Input } from '../../ui/input'

interface Income {
  description: string
  amount: number
  frequency: 'monthly' | 'yearly'
}

interface IncomeFormProps {
  onAddIncome: (income: Omit<Income, 'id'>) => void
}

export function IncomeForm({ onAddIncome }: IncomeFormProps) {
  const [formData, setFormData] = useState<Omit<Income, 'id'>>({
    description: '',
    amount: 0,
    frequency: 'monthly'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.description && formData.amount > 0) {
      onAddIncome(formData)
      setFormData({ description: '', amount: 0, frequency: 'monthly' })
    }
  }

  const frequencyLabels = {
    monthly: 'Mensal',
    yearly: 'Anual'
  }

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <DollarSign className="h-5 w-5" />
          Adicionar Rendimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income-description">Descrição</Label>
              <Input
                id="income-description"
                type="text"
                placeholder="Ex: Salário, Freelance"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="border-green-200 focus-visible:ring-green-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="income-amount">Valor (€)</Label>
              <Input
                id="income-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                min="0.01"
                required
                className="border-green-200 focus-visible:ring-green-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="income-frequency">Frequência</Label>
              <Select value={formData.frequency} onValueChange={(value: Income['frequency']) => setFormData({ ...formData, frequency: value })}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
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
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
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