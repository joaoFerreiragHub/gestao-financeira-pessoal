import type { ProjectionData } from '../../../types/pageContext'
import { formatCurrency } from '../../../utils/financial'

interface ProjectionCardsProps {
  projections: ProjectionData[]
}

export function ProjectionCards({ projections }: ProjectionCardsProps) {
  const years = [5, 10, 15]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {years.map(year => {
        const projection = projections[year - 1]
        
        if (!projection) return null

        return (
          <div key={year} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Projeção {year} anos
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Patrimônio Líquido:</span>
                <span className={`font-bold ${projection.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(projection.netWorth)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Dívidas:</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(projection.totalDebt)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Economias:</span>
                <span className={`font-bold ${projection.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(projection.savings)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}