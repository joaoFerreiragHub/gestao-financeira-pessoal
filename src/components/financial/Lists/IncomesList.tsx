import { Trash2, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Alert, AlertDescription } from '../../ui/alert'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'


interface Income {
  id: string
  description: string
  amount: number
  frequency: 'monthly' | 'yearly'
}

interface IncomesListProps {
  incomes: Income[]
  onRemoveIncome: (id: string) => void
}

export function IncomesList({ incomes, onRemoveIncome }: IncomesListProps) {
  const getFrequencyLabel = (frequency: Income['frequency']) => {
    return frequency === 'monthly' ? 'Mensal' : 'Anual'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getFrequencyColor = (frequency: Income['frequency']) => {
    return frequency === 'monthly' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
  }

  if (incomes.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <DollarSign className="h-5 w-5" />
            Meus Rendimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Nenhum rendimento cadastrado ainda. Adicione seu primeiro rendimento acima para começar a acompanhar suas receitas.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <DollarSign className="h-5 w-5" />
          Meus Rendimentos
          <Badge variant="secondary" className="ml-auto">
            {incomes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {incomes.map((income) => (
          <div 
            key={income.id} 
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{income.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getFrequencyColor(income.frequency)}>
                    <Calendar className="h-3 w-3 mr-1" />
                    {getFrequencyLabel(income.frequency)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg text-green-600">
                {formatCurrency(income.amount)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveIncome(income.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-green-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total mensal estimado:</span>
            <span className="font-bold text-green-600">
              {formatCurrency(
                incomes.reduce((total, income) => 
                  total + (income.frequency === 'monthly' ? income.amount : income.amount / 12), 0
                )
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}