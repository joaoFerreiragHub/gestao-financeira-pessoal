import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
}

export function LoadingSpinner({ 
  message = "Carregando...", 
  size = 'md',
  variant = 'spinner'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  }

  const containerClasses = {
    sm: 'min-h-32',
    md: 'min-h-64',
    lg: 'min-h-screen'
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center ${containerClasses[size]}`}>
        <div className="text-center">
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`bg-blue-600 rounded-full animate-pulse ${
                  size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${containerClasses[size]}`}>
        <div className="text-center">
          <div className={`bg-blue-600 rounded-full animate-ping ${sizeClasses[size]} mx-auto mb-4`}></div>
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center ${containerClasses[size]}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 mx-auto mb-4`}></div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}

// Skeleton Components
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  )
}

export function SkeletonMetricCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <SkeletonMetricCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}