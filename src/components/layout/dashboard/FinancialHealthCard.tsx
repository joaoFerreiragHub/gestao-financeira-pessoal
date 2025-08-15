import React from 'react'
import { TrendingUp, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface FinancialHealthData {
  score: number
  status: string
  savingsRate: number
  debtToAssetRatio: number
  emergencyFundMonths: number
}

interface FinancialHealthCardProps {
  healthData: FinancialHealthData
  showValues?: boolean
}

interface HealthMetricProps {
  label: string
  value: number
  unit: string
  status: 'excellent' | 'good' | 'warning' | 'danger'
  showValue: boolean
  description: string
}

function HealthMetric({ label, value, unit, status, showValue, description }: HealthMetricProps) {
  const statusConfig = {
    excellent: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
    good: { color: 'text-blue-600', bg: 'bg-blue-100', icon: TrendingUp },
    warning: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertTriangle },
    danger: { color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="text-center group relative">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${config.bg} mb-3 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`h-6 w-6 ${config.color}`} />
      </div>
      
      <p className={`text-2xl font-bold ${config.color} mb-1`}>
        {showValue ? `${value.toFixed(1)}${unit}` : '•••'}
      </p>
      
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      
      <p className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white px-2 py-1 rounded z-10">
        {description}
      </p>
    </div>
  )
}

export function FinancialHealthCard({ healthData, showValues = true }: FinancialHealthCardProps) {
  const getScoreStatus = (score: number): 'excellent' | 'good' | 'warning' | 'danger' => {
    if (score >= 80) return 'excellent'
    if (score >= 60) return 'good'
    if (score >= 40) return 'warning'
    return 'danger'
  }

  const getSavingsRateStatus = (rate: number): 'excellent' | 'good' | 'warning' | 'danger' => {
    if (rate >= 20) return 'excellent'
    if (rate >= 10) return 'good'
    if (rate >= 5) return 'warning'
    return 'danger'
  }

  const getDebtRatioStatus = (ratio: number): 'excellent' | 'good' | 'warning' | 'danger' => {
    if (ratio <= 20) return 'excellent'
    if (ratio <= 40) return 'good'
    if (ratio <= 60) return 'warning'
    return 'danger'
  }

  const getEmergencyFundStatus = (months: number): 'excellent' | 'good' | 'warning' | 'danger' => {
    if (months >= 6) return 'excellent'
    if (months >= 3) return 'good'
    if (months >= 1) return 'warning'
    return 'danger'
  }

  const scoreStatus = getScoreStatus(healthData.score)
  const scoreConfig = {
    excellent: { color: 'text-green-600', bg: 'from-green-50 to-emerald-50', border: 'border-green-200' },
    good: { color: 'text-blue-600', bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200' },
    warning: { color: 'text-yellow-600', bg: 'from-yellow-50 to-orange-50', border: 'border-yellow-200' },
    danger: { color: 'text-red-600', bg: 'from-red-50 to-pink-50', border: 'border-red-200' }
  }

  const config = scoreConfig[scoreStatus]

  const insights = [
    healthData.savingsRate >= 20 
      ? "Excelente taxa de poupança! Continue assim."
      : healthData.savingsRate >= 10
      ? "Boa taxa de poupança. Tente aumentar gradualmente."
      : "Considere aumentar suas poupanças mensais.",
    
    healthData.emergencyFundMonths >= 6
      ? "Fundo de emergência adequado."
      : healthData.emergencyFundMonths >= 3
      ? "Fundo de emergência razoável. Considere aumentar."
      : "Priorize a construção de um fundo de emergência.",
    
    healthData.debtToAssetRatio <= 20
      ? "Nível de endividamento muito baixo."
      : healthData.debtToAssetRatio <= 40
      ? "Endividamento sob controle."
      : "Considere reduzir suas dívidas."
  ]

  return (
    <div className={`bg-gradient-to-r ${config.bg} border ${config.border} rounded-xl p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Saúde Financeira</h2>
          <p className="text-gray-600 text-sm">Análise abrangente da sua situação</p>
        </div>
        
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm border-4 ${config.border}`}>
            <div>
              <p className={`text-2xl font-bold ${config.color}`}>
                {showValues ? healthData.score : '••'}
              </p>
              <p className="text-xs text-gray-500">de 100</p>
            </div>
          </div>
          <p className={`text-sm font-semibold ${config.color} mt-2`}>
            {healthData.status}
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <HealthMetric
          label="Taxa de Poupança"
          value={healthData.savingsRate}
          unit="%"
          status={getSavingsRateStatus(healthData.savingsRate)}
          showValue={showValues}
          description="Percentual da renda que consegue poupar mensalmente"
        />
        
        <HealthMetric
          label="Nível de Endividamento"
          value={healthData.debtToAssetRatio}
          unit="%"
          status={getDebtRatioStatus(healthData.debtToAssetRatio)}
          showValue={showValues}
          description="Proporção das dívidas em relação aos seus ativos"
        />
        
        <HealthMetric
          label="Fundo de Emergência"
          value={healthData.emergencyFundMonths}
          unit=" meses"
          status={getEmergencyFundStatus(healthData.emergencyFundMonths)}
          showValue={showValues}
          description="Quantos meses consegue sustentar-se sem rendimentos"
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Score Geral</span>
          <span className={`text-sm font-semibold ${config.color}`}>
            {showValues ? `${healthData.score}/100` : '••/100'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              scoreStatus === 'excellent' ? 'bg-green-500' :
              scoreStatus === 'good' ? 'bg-blue-500' :
              scoreStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: showValues ? `${healthData.score}%` : '0%' }}
          ></div>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">💡 Insights Personalizados</h4>
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start text-sm text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
            <p>{insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}