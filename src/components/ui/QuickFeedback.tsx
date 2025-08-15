// src/components/ui/QuickFeedback.tsx

import { useState, useEffect } from 'react'
import { Check, Info, AlertTriangle, X } from 'lucide-react'

interface FeedbackState {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  isVisible: boolean
}

let setGlobalFeedback: ((state: FeedbackState) => void) | null = null

export function QuickFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState>({
    message: '',
    type: 'success',
    isVisible: false
  })

  // Registar a função global para controle externo
  useEffect(() => {
    setGlobalFeedback = setFeedback
    return () => {
      setGlobalFeedback = null
    }
  }, [])

  // Auto-hide após 2 segundos
  useEffect(() => {
    if (feedback.isVisible) {
      const timer = setTimeout(() => {
        setFeedback(prev => ({ ...prev, isVisible: false }))
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [feedback.isVisible])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="h-4 w-4" />
      case 'error': return <X className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'info': return <Info className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500 text-white'
      case 'error': return 'bg-red-500 text-white'
      case 'warning': return 'bg-yellow-500 text-white'
      case 'info': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  if (!feedback.isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`
        inline-flex items-center px-4 py-2 rounded-lg shadow-lg
        ${getStyles(feedback.type)}
        transform transition-all duration-300 ease-out
      `}>
        {getIcon(feedback.type)}
        <span className="ml-2 text-sm font-medium">
          {feedback.message}
        </span>
      </div>
    </div>
  )
}

// API estática para usar em qualquer lugar
QuickFeedback.show = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
  if (setGlobalFeedback) {
    setGlobalFeedback({
      message,
      type,
      isVisible: true
    })
  }
}