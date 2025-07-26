// src/hooks/usePageContext.ts
import React from 'react'

// Context para acessar pageContext em componentes filhos
const PageContextContext = React.createContext<any>(null)

export function usePageContext() {
  const context = React.useContext(PageContextContext)
  if (!context) {
    throw new Error('usePageContext deve ser usado dentro do PageShell')
  }
  return context
}

export { PageContextContext }