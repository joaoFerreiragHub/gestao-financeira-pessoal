import { useState, useEffect, useCallback } from 'react'

/**
 * Hook SSR-safe para usar localStorage
 * Funciona tanto no servidor quanto no cliente
 */
export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  
  // Estado para controlar se estamos no cliente (após hidratação)
  const [isClient, setIsClient] = useState(false)
  
  // Estado para os dados
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Durante SSR, sempre retorna o valor inicial
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Erro ao ler localStorage para a chave "${key}":`, error)
      return initialValue
    }
  })

  // Efeito para marcar que estamos no cliente após hidratação
  useEffect(() => {
    setIsClient(true)
    
    // Após hidratação, sincronizar com localStorage
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          const parsedItem = JSON.parse(item)
          setStoredValue(parsedItem)
        }
      } catch (error) {
        console.warn(`Erro ao sincronizar localStorage para a chave "${key}":`, error)
      }
    }
  }, [key])

  // Função para atualizar o valor
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Permitir função de callback
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Atualizar estado
      setStoredValue(valueToStore)
      
      // Salvar no localStorage apenas no cliente
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        
        // Disparar evento customizado para sincronização entre abas
        window.dispatchEvent(new CustomEvent('localStorage-update', {
          detail: { key, value: valueToStore }
        }))
      }
    } catch (error) {
      console.error(`Erro ao salvar no localStorage para a chave "${key}":`, error)
    }
  }, [key, storedValue])

  // Sincronização entre abas
  useEffect(() => {
    if (!isClient) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue)
          setStoredValue(newValue)
        } catch (error) {
          console.warn(`Erro ao sincronizar mudança de localStorage:`, error)
        }
      }
    }

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorage-update', handleCustomStorageChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorage-update', handleCustomStorageChange as EventListener)
    }
  }, [key, isClient])

  return [storedValue, setValue, isClient]
}

/**
 * Hook para remover item do localStorage
 */
export function useRemoveFromLocalStorage() {
  return useCallback((key: string) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key)
        window.dispatchEvent(new CustomEvent('localStorage-remove', {
          detail: { key }
        }))
      } catch (error) {
        console.error(`Erro ao remover do localStorage a chave "${key}":`, error)
      }
    }
  }, [])
}

/**
 * Hook para limpar todo o localStorage
 */
export function useClearLocalStorage() {
  return useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.clear()
        window.dispatchEvent(new CustomEvent('localStorage-clear'))
      } catch (error) {
        console.error('Erro ao limpar localStorage:', error)
      }
    }
  }, [])
}