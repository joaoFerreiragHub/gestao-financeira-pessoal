

export interface SummaryCardsProps {
  netWorth: number
  totalBalance: number
  monthlySavings: number
  totalDebt: number
  debtPayoffTime: number
}

export function SummaryCards({ 
  netWorth, 
  totalBalance, 
  monthlySavings, 
  totalDebt, 
  debtPayoffTime 
}: SummaryCardsProps) {
  const formatCurrency = (amount: number) => `€${amount.toLocaleString()}`
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Valor Líquido</h3>
        <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(netWorth)}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Saldo Total</h3>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Poupança Mensal</h3>
        <p className={`text-2xl font-bold ${monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(monthlySavings)}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Dívidas Totais</h3>
        <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Tempo p/ Quitar</h3>
        <p className="text-2xl font-bold text-gray-900">
          {debtPayoffTime === 0 ? 'N/A' : 
           debtPayoffTime === Infinity ? '∞' : 
           `${debtPayoffTime}m`}
        </p>
      </div>
    </div>
  )
}
