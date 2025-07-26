// src/pages/_default.page.client.tsx
import { hydrateRoot } from 'react-dom/client'
import type { PageContext } from '../types/pageContext'
import { PageShell } from '../renderer/PageShell'
import '../index.css'

// Lista de propriedades que devem ser passadas do servidor para o cliente
export const passToClient = ['routeParams', 'pageProps']

export const render = (pageContext: PageContext) => {
  console.log('Cliente: Iniciando hidratação', pageContext)
  
  if (!pageContext) {
    console.error('PageContext não encontrado no cliente')
    return
  }

  const { Page, pageProps } = pageContext

  // Verificar se elemento app existe
  const appElement = document.getElementById('app')
  if (!appElement) {
    console.error('Elemento #app não encontrado no DOM')
    return
  }

  try {
    // Hidratação da aplicação
    hydrateRoot(
      appElement,
      <PageShell pageContext={pageContext}>
        <Page {...(pageProps || {})} />
      </PageShell>
    )
    
    console.log('Cliente: Hidratação concluída com sucesso')
    
    // Marcar hidratação como completa
    if (typeof window !== 'undefined') {
      window.__HYDRATION_COMPLETE__ = true
    }
    
  } catch (error) {
    console.error('Erro durante a hidratação:', error)
    
    // Fallback: renderização completa no cliente se hidratação falhar
    import('react-dom/client').then(({ createRoot }) => {
      console.warn('Fallback: Renderizando do zero no cliente')
      const root = createRoot(appElement)
      root.render(
        <PageShell pageContext={pageContext}>
          <Page {...(pageProps || {})} />
        </PageShell>
      )
    })
  }
}

// Extensão global para debug
declare global {
  interface Window {
    __HYDRATION_COMPLETE__?: boolean
  }
}