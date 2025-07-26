interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ 
  message = "Carregando aplicação financeira...", 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  const containerClasses = {
    sm: 'min-h-32',
    md: 'min-h-96',
    lg: 'min-h-screen'
  }

  return (
    <div className={`flex items-center justify-center ${containerClasses[size]}`}>
      <div className="text-center">
        <div 
          className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto mb-4`}
        />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}