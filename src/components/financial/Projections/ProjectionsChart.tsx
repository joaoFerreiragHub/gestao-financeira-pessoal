// src/components/financial/Projections/ProjectionsChart.tsx
import { useState, useEffect } from 'react'
import type { ProjectionData } from '../../../types/pageContext'

export interface ProjectionsChartProps {
  projections: ProjectionData[]
  isReady: boolean
}

function ClientOnlyProjectionsChart({ projections }: Omit<ProjectionsChartProps, 'isReady'>) {
  const [RechartsComponents, setRechartsComponents] = useState<any>(null)

  useEffect(() => {
    const loadRecharts = async () => {
      try {
        const recharts = await import('recharts')
        setRechartsComponents(recharts)
      } catch (error) {
        console.error('Erro ao carregar Recharts:', error)
      }
    }

    loadRecharts()
  }, [])

  if (!RechartsComponents || projections.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Projeções Financeiras</h3>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
          {!RechartsComponents ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">A carregar gráfico...</p>
            </div>
          ) : (
            <p className="text-gray-500">Adicione dados financeiros para ver as projeções</p>
          )}
        </div>
      </div>
    )
  }

  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = RechartsComponents

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Projeções Financeiras (15 anos)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={projections}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Anos', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Valor (€)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `€${value.toLocaleString()}`, 
              name === 'netWorth' ? 'Valor Líquido' : 
              name === 'totalDebt' ? 'Dívidas' : 
              name === 'savings' ? 'Poupanças' : name
            ]}
            labelFormatter={(label) => `Ano ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="netWorth" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Valor Líquido"
          />
          <Line 
            type="monotone" 
            dataKey="totalDebt" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="Dívidas"
          />
          <Line 
            type="monotone" 
            dataKey="savings" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Poupanças Acumuladas"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ProjectionsChart({ projections, isReady }: ProjectionsChartProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isReady || !isClient) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Projeções Financeiras</h3>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">A preparar projeções...</p>
          </div>
        </div>
      </div>
    )
  }

  return <ClientOnlyProjectionsChart projections={projections} />
}