import { TrendingUp, CreditCard, PiggyBank, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '../../../utils/financial'

interface SummaryCardsProps {
  netWorth: number
  totalBalance: number
  monthlySavings: number
  totalDebt: number
  debtPayoffTime?: number
}

export function SummaryCards({ 
  netWorth, 
  totalBalance, 
  monthlySavings, 
  totalDebt, 
  debtPayoffTime 
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Patrimônio Líquido */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Patrimônio Líquido</p>
            <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netWorth)}
            </p>
          </div>
          <TrendingUp className={`w-8 h-8 ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>

      {/* Saldo Total */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Saldo Total</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBalance)}</p>
          </div>
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Economia Mensal */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Economia Mensal</p>
            <p className={`text-2xl font-bold ${monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(monthlySavings)}
            </p>
          </div>
          <PiggyBank className={`w-8 h-8 ${monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>

      {/* Total Dívidas */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Dívidas</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
            {debtPayoffTime !== undefined && debtPayoffTime !== Infinity && debtPayoffTime > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Quitação em ~{Math.ceil(debtPayoffTime / 12)} anos
              </p>
            )}
          </div>
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </div>
    </div>
  )
}