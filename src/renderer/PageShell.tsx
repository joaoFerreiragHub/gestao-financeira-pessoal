// src/renderer/PageShell.tsx
import type { ReactNode } from 'react'
import { PageContextContext } from '../hooks/usePageContext'

interface PageShellProps {
  children: ReactNode
  pageContext: any // Usar any temporariamente para evitar conflitos de tipos
}

export function PageShell({ children, pageContext }: PageShellProps) {
  return (
    <PageContextContext.Provider value={pageContext}>
      <div className="min-h-screen bg-gray-50">
        {/* Cabeçalho */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                💰 Gestão Financeira Pessoal
              </h1>
              <div className="text-sm text-gray-600">
                Sistema de gestão financeira pessoal
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>

        {/* Rodapé */}
        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 text-sm">
                © 2025 Gestão Financeira Pessoal. Todos os direitos reservados.
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-gray-500 text-sm">
                  Feito com ❤️ e React + SSR
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageContextContext.Provider>
  )
}