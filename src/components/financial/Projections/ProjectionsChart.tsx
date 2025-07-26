import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ProjectionData } from '../../../types/pageContext'
import { formatCurrency } from '../../../utils/financial'

interface ProjectionsChartProps {
  projections: ProjectionData[]
  isReady: boolean
}

export function ProjectionsChart({ projections, isReady }: ProjectionsChartProps) {
  if (!isReady) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Projeções Financeiras (15 anos)
      </h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={projections}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Anos', position: 'insideBottom', offset: -10 }} 
          />
          <YAxis 
            label={{ value: 'Valor (€)', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip 
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Ano ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="netWorth" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            name="Patrimônio Líquido" 
          />
          <Line 
            type="monotone" 
            dataKey="totalDebt" 
            stroke="#ef4444" 
            strokeWidth={2} 
            name="Dívidas" 
          />
          <Line 
            type="monotone" 
            dataKey="savings" 
            stroke="#22c55e" 
            strokeWidth={2} 
            name="Economias Acumuladas" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}