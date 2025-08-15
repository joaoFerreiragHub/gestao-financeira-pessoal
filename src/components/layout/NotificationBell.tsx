// src/components/layout/NotificationBell.tsx

import { useState } from 'react'
import { Bell, X, AlertTriangle, TrendingDown, Calendar } from 'lucide-react'

interface Notification {
  id: string
  type: 'warning' | 'info' | 'success'
  title: string
  message: string
  time: string
  priority: 'high' | 'medium' | 'low'
}

interface NotificationBellProps {
  count?: number
}

export function NotificationBell({ count = 0 }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Notificações de exemplo (em produção viriam de um hook)
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Orçamento excedido',
      message: 'Gastos em Alimentação ultrapassaram €400 este mês',
      time: 'há 2 horas',
      priority: 'high'
    },
    {
      id: '2',
      type: 'info',
      title: 'Pagamento pendente',
      message: 'Renda do apartamento vence amanhã',
      time: 'há 1 dia',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'success',
      title: 'Meta atingida',
      message: 'Parabéns! Atingiu a meta de poupança mensal',
      time: 'há 3 dias',
      priority: 'low'
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'info': return <Calendar className="h-4 w-4 text-blue-500" />
      case 'success': return <TrendingDown className="h-4 w-4 text-green-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const highPriorityCount = notifications.filter(n => n.priority === 'high').length

  return (
    <div className="relative">
      {/* Botão da notificação */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 
                   rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Bell className="h-5 w-5" />
        {highPriorityCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center 
                           rounded-full bg-red-500 text-xs font-medium text-white ring-2 ring-white">
            {highPriorityCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificações */}
      {isOpen && (
        <>
          {/* Overlay para fechar */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel de notificações */}
          <div className="absolute right-0 top-12 z-20 w-80 bg-white rounded-xl shadow-lg border border-gray-200 
                          animate-scale-in overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Notificações ({notifications.length})
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Lista de notificações */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {notification.priority === 'high' && (
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Sem notificações</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Marcar todas como lidas
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}