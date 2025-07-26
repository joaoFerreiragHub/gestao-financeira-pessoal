import { TrendingUp, AlertTriangle, PiggyBank, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Progress } from '../../ui/progress'

interface FinancialHealthData {
  score: number
  status: string
  savingsRate: number
  debtToAssetRatio: number
  emergencyFundMonths: number
}

interface FinancialHealthCardProps {
  healthData: FinancialHealthData
}

export function FinancialHealthCard({ healthData }: FinancialHealthCardProps) {
  const { score, status, savingsRate, debtToAssetRatio, emergencyFundMonths } = healthData

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100)
  }

  // Cor do status baseada no score
  const getStatusVariant = (score: number) => {
    if (score >= 80) return { variant: 'default', className: 'bg-green-100 text-green-800' }
    if (score >= 60) return { variant: 'default', className: 'bg-blue-100 text-blue-800' }
    if (score >= 40) return { variant: 'default', className: 'bg-orange-100 text-orange-800' }
    return { variant: 'destructive', className: 'bg-red-100 text-red-800' }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const statusVariant = getStatusVariant(score)

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-green-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>Saúde Financeira</span>
          </div>
          <Badge className={statusVariant.className}>
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Principal */}
        <div className="text-center space-y-2">
          <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </div>
          <Progress value={score} className="w-full h-3" />
          <p className="text-sm text-muted-foreground">Score Geral</p>
        </div>
        
        {/* Métricas Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Taxa de Poupança</span>
            </div>
            <p className="text-xl font-bold text-green-600">
              {formatPercentage(savingsRate)}
            </p>
            <Progress value={Math.min(savingsRate, 30) * (100/30)} className="mt-2 h-2" />
            <p className="text-xs text-gray-500 mt-1">Meta: 20%</p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Endividamento</span>
            </div>
            <p className="text-xl font-bold text-orange-600">
              {formatPercentage(debtToAssetRatio)}
            </p>
            <Progress value={Math.min(debtToAssetRatio, 50) * 2} className="mt-2 h-2" />
            <p className="text-xs text-gray-500 mt-1">Ideal: &lt; 30%</p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PiggyBank className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Reserva de Emergência</span>
            </div>
            <p className="text-xl font-bold text-purple-600">
              {emergencyFundMonths.toFixed(1)} meses
            </p>
            <Progress value={Math.min(emergencyFundMonths, 6) * (100/6)} className="mt-2 h-2" />
            <p className="text-xs text-gray-500 mt-1">Meta: 6 meses</p>
          </div>
        </div>

        {/* Dicas baseadas no score */}
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-gray-900 mb-2">Recomendação:</h4>
          {score >= 80 && (
            <p className="text-sm text-gray-600">
              Excelente! Continue mantendo seus bons hábitos financeiros e considere diversificar seus investimentos.
            </p>
          )}
          {score >= 60 && score < 80 && (
            <p className="text-sm text-gray-600">
              Boa saúde financeira! Foque em aumentar sua reserva de emergência e reduzir dívidas se possível.
            </p>
          )}
          {score >= 40 && score < 60 && (
            <p className="text-sm text-gray-600">
              Há espaço para melhorias. Considere revisar seus gastos e criar um plano de poupança mensal.
            </p>
          )}
          {score < 40 && (
            <p className="text-sm text-gray-600">
              Atenção necessária! Priorize reduzir gastos, quitar dívidas e criar uma reserva de emergência.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}