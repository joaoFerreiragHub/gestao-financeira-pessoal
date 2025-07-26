import { Trash2, TrendingDown, Calendar, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Alert, AlertDescription } from '../../ui/alert'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  frequency: 'monthly' | 'yearly'
}

interface ExpensesListProps {
  expenses: Expense[]
  onRemoveExpense: (id: string) => void
}

export function ExpensesList({ expenses, onRemoveExpense }: ExpensesListProps) {
  const getFrequencyLabel = (frequency: Expense['frequency']) => {
    return frequency === 'monthly' ? 'Mensal' : 'Anual'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getFrequencyColor = (frequency: Expense['frequency']) => {
    return frequency === 'monthly' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Alimentação': 'bg-emerald-100 text-emerald-800',
      'Transporte': 'bg-blue-100 text-blue-800',
      'Habitação': 'bg-purple-100 text-purple-800',
      'Saúde': 'bg-pink-100 text-pink-800',
      'Educação': 'bg-indigo-100 text-indigo-800',
      'Entretenimento': 'bg-yellow-100 text-yellow-800',
      'Vestuário': 'bg-teal-100 text-teal-800',
      'Seguros': 'bg-gray-100 text-gray-800',
      'Comunicações': 'bg-cyan-100 text-cyan-800',
      'Outros': 'bg-slate-100 text-slate-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (expenses.length === 0) {
    return (
      <Card className="border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <TrendingDown className="h-5 w-5" />
            Minhas Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <TrendingDown className="h-4 w-4" />
            <AlertDescription>
              Nenhuma despesa cadastrada ainda. Adicione sua primeira despesa acima para começar a acompanhar seus gastos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <TrendingDown className="h-5 w-5" />
          Minhas Despesas
          <Badge variant="secondary" className="ml-auto">
            {expenses.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {expenses.map((expense) => (
          <div 
            key={expense.id} 
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{expense.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getCategoryColor(expense.category)}>
                    <Tag className="h-3 w-3 mr-1" />
                    {expense.category}
                  </Badge>
                  <Badge variant="outline" className={getFrequencyColor(expense.frequency)}>
                    <Calendar className="h-3 w-3 mr-1" />
                    {getFrequencyLabel(expense.frequency)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg text-red-600">
                {formatCurrency(expense.amount)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveExpense(expense.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-red-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total mensal estimado:</span>
            <span className="font-bold text-red-600">
              {formatCurrency(
                expenses.reduce((total, expense) => 
                  total + (expense.frequency === 'monthly' ? expense.amount : expense.amount / 12), 0
                )
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}