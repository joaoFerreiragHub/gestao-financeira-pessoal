// src/components/financial/Dashboard/Charts.tsx
import { useState, useEffect } from 'react'

export interface ChartsProps {
  pieChartData: Array<{ name: string; value: number; fill: string }>
  barChartData: Array<{ name: string; value: number }>
  isReady: boolean
}

// Componente que só renderiza gráficos no cliente
function ClientOnlyCharts({ pieChartData, barChartData }: Omit<ChartsProps, 'isReady'>) {
  const [RechartsComponents, setRechartsComponents] = useState<any>(null)

  useEffect(() => {
    // Carregar Recharts apenas no cliente
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

  if (!RechartsComponents) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribuição Financeira</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">A carregar gráfico...</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Saldos por Conta</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">A carregar gráfico...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = RechartsComponents

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pizza */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Distribuição Financeira</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`€${value.toLocaleString()}`, '']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Barras */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Saldos por Conta</h3>
        {barChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`€${value.toLocaleString()}`, 'Saldo']} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Adicione contas para ver o gráfico</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function Charts({ pieChartData, barChartData, isReady }: ChartsProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isReady || !isClient) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribuição Financeira</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">A preparar gráficos...</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Saldos por Conta</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">A preparar gráficos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <ClientOnlyCharts pieChartData={pieChartData} barChartData={barChartData} />
}