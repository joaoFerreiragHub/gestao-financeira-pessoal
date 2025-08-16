// src/components/financial/emergency-fund/components/FundStatusCard.tsx
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface FundStatusCardProps {
  status: {
    status: 'critical' | 'low' | 'building' | 'adequate' | 'excellent';
    color: string;
    message: string;
    recommendations: string[];
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
  const getStatusIcon = () => {
    switch (status.status) {
      case 'excellent':
        return <CheckCircle className="h-8 w-8" />;
      case 'adequate':
        return <Shield className="h-8 w-8" />;
      case 'building':
        return <Clock className="h-8 w-8" />;
      case 'low':
      case 'critical':
        return <AlertTriangle className="h-8 w-8" />;
      default:
        return <Shield className="h-8 w-8" />;
    }
  };

  const getColorClasses = () => {
    switch (status.status) {
      case 'excellent':
        return {
          gradient: 'from-green-500 to-green-600',
          bg: 'bg-green-50',
          text: 'text-green-900',
          accent: 'text-green-100'
        };
      case 'adequate':
        return {
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50',
          text: 'text-blue-900',
          accent: 'text-blue-100'
        };
      case 'building':
        return {
          gradient: 'from-yellow-500 to-yellow-600',
          bg: 'bg-yellow-50',
          text: 'text-yellow-900',
          accent: 'text-yellow-100'
        };
      case 'low':
        return {
          gradient: 'from-orange-500 to-orange-600',
          bg: 'bg-orange-50',
          text: 'text-orange-900',
          accent: 'text-orange-100'
        };
      case 'critical':
        return {
          gradient: 'from-red-500 to-red-600',
          bg: 'bg-red-50',
          text: 'text-red-900',
          accent: 'text-red-100'
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          accent: 'text-gray-100'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`bg-gradient-to-r ${colors.gradient} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {getStatusIcon()}
          <div>
            <h2 className="text-2xl font-bold">{status.message}</h2>
            <p className={`text-lg ${colors.accent}`}>
              Estado do seu fundo de emergência
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-1">
            {showBalances ? `${Math.min(progressPercentage, 100).toFixed(0)}%` : '••%'}
          </div>
          <p className={colors.accent}>da meta</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`${colors.bg} ${colors.text} rounded-lg p-4`}>
          <p className="text-sm opacity-75">Valor Atual</p>
          <p className="text-xl font-bold">
            {showBalances ? formatCurrency(currentAmount) : '€ ••••••'}
          </p>
        </div>
        <div className={`${colors.bg} ${colors.text} rounded-lg p-4`}>
          <p className="text-sm opacity-75">Cobertura</p>
          <p className="text-xl font-bold">
            {showBalances ? `${currentMonths.toFixed(1)} meses` : '••• meses'}
          </p>
        </div>
        <div className={`${colors.bg} ${colors.text} rounded-lg p-4`}>
          <p className="text-sm opacity-75">Meta</p>
          <p className="text-xl font-bold">
            {showBalances ? formatCurrency(targetAmount) : '€ ••••••'}
          </p>
        </div>
      </div>
      
      {/* Barra de Progresso */}
      <div className="mb-4">
        <div className="w-full bg-white/20 rounded-full h-4">
          <div 
            className="bg-white h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          >
            {progressPercentage > 15 && (
              <span className="text-xs font-medium text-gray-700">
                {Math.min(progressPercentage, 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recomendações */}
      {status.recommendations.length > 0 && (
        <div className={`${colors.bg} ${colors.text} rounded-lg p-4`}>
          <h4 className="font-semibold mb-2">Recomendações:</h4>
          <ul className="text-sm space-y-1">
            {status.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};