import { useState } from 'react'
import { CreditCard, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Input } from '../../ui/input'

interface Account {
  name: string
  balance: number
  type: 'checking' | 'savings' | 'investment'
}

interface AccountFormProps {
  onAddAccount: (account: Omit<Account, 'id'>) => void
}

export function AccountForm({ onAddAccount }: AccountFormProps) {
  const [formData, setFormData] = useState<Omit<Account, 'id'>>({
    name: '',
    balance: 0,
    type: 'checking'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.balance >= 0) {
      onAddAccount(formData)
      setFormData({ name: '', balance: 0, type: 'checking' })
    }
  }

  const accountTypeLabels = {
    checking: 'Conta Corrente',
    savings: 'Poupança', 
    investment: 'Investimento'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Adicionar Nova Conta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account-name">Nome da conta</Label>
              <Input
                id="account-name"
                type="text"
                placeholder="Ex: Banco CTT"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-balance">Saldo inicial</Label>
              <Input
                id="account-balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.balance || ''}
                onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                min="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-type">Tipo de conta</Label>
              <Select value={formData.type} onValueChange={(value: Account['type']) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(accountTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button type="submit" className="w-full">
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