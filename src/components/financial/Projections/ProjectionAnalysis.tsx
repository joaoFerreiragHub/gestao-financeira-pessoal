import type { ProjectionData, FinancialState } from '../../../types/pageContext'
import { 
  formatCurrency, 
  formatPercentage, 
  calculateMonthlySavings, 
  calculateNetWorth,
  calculateTotalDebt,
  calculateFinancialHealth,
  calculateDebtPayoffTime
} from '../../../utils/financial'

interface ProjectionAnalysisProps {
  projections: ProjectionData[]
  financialData: FinancialState
}

export function ProjectionAnalysis({ projections, financialData }: ProjectionAnalysisProps) {
  const monthlySavings = calculateMonthlySavings(financialData)
  const netWorth = calculateNetWorth(financialData)
const totalDebt = calculateTotalDebt(financialData.debts)
  const financialHealth = calculateFinancialHealth(financialData)
const debtPayoffTime = calculateDebtPayoffTime(financialData.debts)

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Análise das Projeções</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Situação Atual */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Situação Atual</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Economia mensal:</span>
              <span className={`font-bold ${monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthlySavings)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Taxa de poupança:</span>
              <span className="font-bold">
                {formatPercentage(financialHealth.savingsRate)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Ratio dívida/patrimônio:</span>
              <span className="font-bold">
                {formatPercentage(financialHealth.debtToAssetRatio)}
              </span>
            </li>
          </ul>
        </div>

        {/* Tendências */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Tendências</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="mr-2">Em 5 anos:</span>
              <span className={`font-bold ${
                projections[4]?.netWorth >= netWorth ? 'text-green-600' : 'text-red-600'
              }`}>
                {projections[4]?.netWorth >= netWorth ? '📈 Crescimento' : '📉 Declínio'} do patrimônio
              </span>
            </li>
            <li>
              <span className="mr-2">Em 10 anos:</span>
              <span className={`font-bold ${
                projections[9]?.totalDebt <= totalDebt / 2 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {projections[9]?.totalDebt <= totalDebt / 2 
                  ? '✅ Redução significativa' 
                  : '⚠️ Dívidas persistentes'
                } das dívidas
              </span>
            </li>
            <li>
              <span className="mr-2">Tempo para quitação:</span>
              <span className="font-bold text-blue-600">
                {totalDebt > 0 && debtPayoffTime !== Infinity 
                  ? `~${Math.ceil(debtPayoffTime / 12)} anos` 
                  : 'Sem dívidas ou indefinido'
                }
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}