import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div id="page-shell">
      <Layout>
        <Content>{children}</Content>
      </Layout>
    </div>
  )
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              💰 Gestão Financeira
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </a>
            <a 
              href="/relatorios" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Relatórios
            </a>
            <a 
              href="/configuracoes" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Configurações
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

function Content({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {children}
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            © 2025 Gestão Financeira Pessoal. Todos os direitos reservados.
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm">
              Feito com ❤️ e React
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}