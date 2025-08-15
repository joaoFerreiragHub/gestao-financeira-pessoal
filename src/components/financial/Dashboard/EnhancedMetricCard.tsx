// src/components/financial/Dashboard/EnhancedMetricCard.tsx

import { useState } from 'react'
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'neutral'
  value?: number
}

function TrendIndicator({ trend, value }: TrendIndicatorProps) {
  if (trend === 'neutral' || !value) return null
  
  return (
    <div className={`inline-flex items-center text-xs font-medium ${
      trend === 'up' ? 'text-green-600' : 'text-red-600'
    }`}>
      {trend === 'up' ? (
        <TrendingUp className="h-3 w-3 mr-1" />
      ) : (
        <TrendingDown className="h-3 w-3 mr-1" />
      )}
      {Math.abs(value).toFixed(1)}%
    </div>
  )
}

interface EnhancedMetricCardProps {
  title: string
  value: number
  previousValue?: number
  icon: React.ElementType
  color: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'indigo'
  formatAsCurrency?: boolean
  showValue: boolean
  onClick?: () => void
  loading?: boolean
}

export function EnhancedMetricCard({
  title,
  value,
  previousValue,
  icon: Icon,
  color,
  formatAsCurrency = false,
  showValue,
  onClick,
  loading = false
}: EnhancedMetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatValue = (val: number) => {
    if (formatAsCurrency) {
      return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val)
    }
    return val.toLocaleString('pt-PT')
  }

  const getTrend = (): { trend: 'up' | 'down' | 'neutral'; percentage: number } => {
    if (!previousValue || previousValue === 0) return { trend: 'neutral', percentage: 0 }
    
    const percentage = ((value - previousValue) / previousValue) * 100
    
    if (Math.abs(percentage) < 1) return { trend: 'neutral', percentage: 0 }
    
    return {
      trend: percentage > 0 ? 'up' : 'down',
      percentage: Math.abs(percentage)
    }
  }

  const { trend, percentage } = getTrend()

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100 group-hover:bg-blue-200',
      green: 'text-green-600 bg-green-100 group-hover:bg-green-200',
      red: 'text-red-600 bg-red-100 group-hover:bg-red-200',
      purple: 'text-purple-600 bg-purple-100 group-hover:bg-purple-200',
      yellow: 'text-yellow-600 bg-yellow-100 group-hover:bg-yellow-200',
      indigo: 'text-indigo-600 bg-indigo-100 group-hover:bg-indigo-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group bg-white rounded-xl border border-gray-200 p-6 shadow-sm
        transition-all duration-200 text-left w-full
        ${onClick ? 'hover:border-blue-300 hover:shadow-lg cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20' : ''}
        ${loading ? 'animate-pulse' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg transition-colors ${getColorClasses(color)}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        
        {trend !== 'neutral' && (
          <TrendIndicator trend={trend} value={percentage} />
        )}
      </div>

      {/* Valor principal */}
      <div className="space-y-2">
        <p className={`text-3xl font-bold transition-colors ${
          onClick ? 'text-gray-900 group-hover:text-blue-700' : 'text-gray-900'
        }`}>
          {showValue ? formatValue(value) : '€•••••'}
        </p>
        
        {previousValue && showValue && (
          <p className="text-sm text-gray-500">
            vs. anterior: {formatValue(previousValue)}
          </p>
        )}
        
        {!previousValue && (
          <p className="text-sm text-gray-500">
            Atualizado há 5 min
          </p>
        )}
      </div>

      {/* Hover hint para cards clicáveis */}
      {onClick && (
        <div className={`mt-4 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="text-xs text-blue-600 font-medium">
            Clique para ver detalhes →
          </span>
        </div>
      )}
    </Component>
  )
}

// Grid de métricas melhorado
interface EnhancedMetricGridProps {
  financialData: {
    totalBalance: number
    monthlyIncome: number
    monthlyExpenses: number
    netWorth: number
    monthlySavings: number
  }
  showBalances: boolean
  onToggleBalances: () => void
  onMetricClick?: (metricType: string) => void
  loading?: boolean
}

export function EnhancedMetricGrid({ 
  financialData, 
  showBalances, 
  onToggleBalances, 
  onMetricClick,
  loading = false 
}: EnhancedMetricGridProps) {
  const metrics = [
    {
      title: 'Patrimônio Líquido',
      value: financialData.netWorth,
      previousValue: financialData.netWorth * 0.92,
      icon: Wallet,
      color: 'blue' as const,
      formatAsCurrency: true
    },
    {
      title: 'Receitas Mensais',
      value: financialData.monthlyIncome,
      previousValue: financialData.monthlyIncome * 0.97,
      icon: TrendingUp,
      color: 'green' as const,
      formatAsCurrency: true
    },
    {
      title: 'Despesas Mensais',
      value: financialData.monthlyExpenses,
      previousValue: financialData.monthlyExpenses * 1.05,
      icon: TrendingDown,
      color: 'red' as const,
      formatAsCurrency: true
    },
    {
      title: 'Poupança Mensal',
      value: financialData.monthlySavings,
      previousValue: financialData.monthlySavings * 0.85,
      icon: PiggyBank,
      color: 'purple' as const,
      formatAsCurrency: true
    }
  ]

  return (
    <div className="space-y-4">
      {/* Toggle de visibilidade */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Métricas Principais</h2>
        <button
          onClick={onToggleBalances}
          className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 
                     hover:bg-gray-100 rounded-lg transition-colors"
        >
          {showBalances ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Ocultar valores
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Mostrar valores
            </>
          )}
        </button>
      </div>

      {/* Grid responsivo - 2 colunas no mobile, 4 no desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <EnhancedMetricCard
            key={metric.title}
            {...metric}
            showValue={showBalances}
            onClick={onMetricClick ? () => onMetricClick(metric.title) : undefined}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}