import React, { useEffect, useState } from 'react'
import { LucideIcon, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number
  previousValue?: number
  icon: LucideIcon
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'indigo'
  showValue?: boolean
  onToggleValue?: () => void
  formatAsPercentage?: boolean
  formatAsCurrency?: boolean
  suffix?: string
  loading?: boolean
  onClick?: () => void
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    border: 'border-blue-200',
    text: 'text-blue-700',
    light: 'bg-blue-50'
  },
  green: {
    bg: 'bg-green-500',
    border: 'border-green-200',
    text: 'text-green-700',
    light: 'bg-green-50'
  },
  red: {
    bg: 'bg-red-500',
    border: 'border-red-200',
    text: 'text-red-700',
    light: 'bg-red-50'
  },
  purple: {
    bg: 'bg-purple-500',
    border: 'border-purple-200',
    text: 'text-purple-700',
    light: 'bg-purple-50'
  },
  orange: {
    bg: 'bg-orange-500',
    border: 'border-orange-200',
    text: 'text-orange-700',
    light: 'bg-orange-50'
  },
  indigo: {
    bg: 'bg-indigo-500',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    light: 'bg-indigo-50'
  }
}

export function MetricCard({
  title,
  value,
  previousValue,
  icon: Icon,
  color,
  showValue = true,
  onToggleValue,
  formatAsPercentage = false,
  formatAsCurrency = true,
  suffix = '',
  loading = false,
  onClick
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animação do valor
  useEffect(() => {
    if (loading) return

    setIsAnimating(true)
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment
      
      if (step >= steps) {
        setAnimatedValue(value)
        setIsAnimating(false)
        clearInterval(timer)
      } else {
        setAnimatedValue(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, loading])

  const formatValue = (val: number): string => {
    if (formatAsPercentage) {
      return `${val.toFixed(1)}%`
    }
    
    if (formatAsCurrency) {
      return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: val >= 1000 ? 0 : 2
      }).format(val)
    }
    
    return `${val.toFixed(0)}${suffix}`
  }

  const calculateChange = (): { percentage: number; isPositive: boolean } | null => {
    if (!previousValue || previousValue === 0) return null
    
    const change = ((value - previousValue) / previousValue) * 100
    return {
      percentage: Math.abs(change),
      isPositive: change >= 0
    }
  }

  const change = calculateChange()
  const classes = colorClasses[color]

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border ${classes.border} p-6 animate-pulse`}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  return (
    <div 
      className={`bg-white rounded-xl border ${classes.border} p-6 shadow-sm hover:shadow-md transition-all duration-300 group ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-medium ${classes.text}`}>{title}</h3>
        <div className="flex items-center space-x-2">
          {change && (
            <div className={`flex items-center text-xs font-medium ${
              change.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {change.percentage.toFixed(1)}%
            </div>
          )}
          
          <div className={`p-2 rounded-lg ${classes.bg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          
          {onToggleValue && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleValue()
              }}
              className={`p-1 rounded hover:${classes.light} transition-colors`}
            >
              {showValue ? (
                <Eye className="h-4 w-4 text-gray-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="space-y-1">
        <p className={`text-2xl font-bold ${classes.text} ${isAnimating ? 'animate-pulse' : ''}`}>
          {showValue ? formatValue(animatedValue) : '€•••••'}
        </p>
        
        {change && (
          <p className="text-xs text-gray-500">
            vs. período anterior: {showValue ? formatValue(previousValue || 0) : '€•••••'}
          </p>
        )}
        
        {!change && (
          <p className="text-xs text-gray-500">
            Última atualização: há 5 min
          </p>
        )}
      </div>
    </div>
  )
}

// Componente de Grid de Métricas
interface MetricGridProps {
  financialData: {
    totalBalance: number
    monthlyIncome: number
    monthlyExpenses: number
    netWorth: number
    monthlySavings: number
  }
  showBalances: boolean
  onToggleBalances: () => void
  loading?: boolean
}

export function MetricGrid({ 
  financialData, 
  showBalances, 
  onToggleBalances, 
  loading = false 
}: MetricGridProps) {
  const metrics = [
    {
      title: 'Patrimônio Líquido',
      value: financialData.netWorth,
      previousValue: financialData.netWorth * 0.92, // Simulando crescimento de 8%
      icon: Wallet,
      color: 'blue' as const,
      formatAsCurrency: true
    },
    {
      title: 'Receitas Mensais',
      value: financialData.monthlyIncome,
      previousValue: financialData.monthlyIncome * 0.97, // Crescimento de 3%
      icon: TrendingUp,
      color: 'green' as const,
      formatAsCurrency: true
    },
    {
      title: 'Despesas Mensais',
      value: financialData.monthlyExpenses,
      previousValue: financialData.monthlyExpenses * 1.05, // Redução de 5%
      icon: TrendingDown,
      color: 'red' as const,
      formatAsCurrency: true
    },
    {
      title: 'Poupança Mensal',
      value: financialData.monthlySavings,
      previousValue: financialData.monthlySavings * 0.85, // Melhoria de 15%
      icon: PiggyBank,
      color: 'purple' as const,
      formatAsCurrency: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.title}
          {...metric}
          showValue={showBalances}
          onToggleValue={index === 0 ? onToggleBalances : undefined} // Só o primeiro card controla a visibilidade
          loading={loading}
          onClick={() => console.log(`Clicked on ${metric.title}`)}
        />
      ))}
    </div>
  )
}