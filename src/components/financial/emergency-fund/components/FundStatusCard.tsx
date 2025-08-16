import React from 'react';

interface FundStatusCardProps {
  status: {
    status: string;
    color: string;
    message: string;
  };
  currentAmount: number;
  targetAmount: number;
  currentMonths: number;
  progressPercentage: number;
  showBalances: boolean;
  formatCurrency: (value: number) => string;
}

export const FundStatusCard: React.FC<FundStatusCardProps> = ({
  status,
  currentAmount,
  targetAmount,
  currentMonths,
  progressPercentage,
  showBalances,
  formatCurrency
}) => {
  return (
    <div className={`bg-gradient-to-r from-${status.color}-500 to-${status.color}-600 rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{status.message}</h2>
          <p className="text-lg opacity-90">
            Tem {showBalances ? formatCurrency(currentAmount) : '••••••'} de fundo de emergência
          </p>
          <p className="opacity-75">
            Corresponde a {showBalances ? currentMonths.toFixed(1) : '•••'} meses de despesas
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {showBalances ? `${progressPercentage.toFixed(0)}%` : '••%'}
          </div>
          <p className="opacity-75">da meta atual</p>
        </div>
      </div>
      
      {/* Barra de Progresso */}
      <div className="mt-6">
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm opacity-75 mt-2">
          <span>Progresso atual</span>
          <span>Meta: {formatCurrency(targetAmount)}</span>
        </div>
      </div>
    </div>
  );
};