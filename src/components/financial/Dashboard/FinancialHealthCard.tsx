import { Target } from 'lucide-react'
import { formatPercentage } from '../../../utils/financial'

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

  // Cor do status baseada no score
  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Saúde Financeira</h2>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">
            Score: {score}/100
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className={`text-2xl font-bold ${getStatusColor(score)}`}>
            {status}
          </p>
          <p className="text-sm text-gray-600">Status Geral</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {formatPercentage(savingsRate)}
          </p>
          <p className="text-sm text-gray-600">Taxa de Poupança</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {formatPercentage(debtToAssetRatio)}
          </p>
          <p className="text-sm text-gray-600">Endividamento</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {emergencyFundMonths.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Meses de Reserva</p>
        </div>
      </div>
    </div>
  )
}