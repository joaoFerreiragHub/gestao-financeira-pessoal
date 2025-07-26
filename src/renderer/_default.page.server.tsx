import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import type { PageContext } from '../types/pageContext'
import { PageShell } from '../servidor/PageShell'


export const passToClient = ['routeParams', 'pageProps', 'user']

export const render = async (pageContext: PageContext) => {
  const { Page, pageProps } = pageContext

  // Renderizar a aplicação no servidor
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell>
      <Page {...(pageProps || {})} />
    </PageShell>
  )

  // Template HTML completo
  const documentHtml = escapeInject`<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Aplicação de gestão financeira pessoal com controle de rendimentos, despesas, contas bancárias e projeções futuras." />
    <title>Gestão Financeira Pessoal</title>
    
    <!-- Prevenção de FOUC (Flash of Unstyled Content) -->
    <style>
      /* Critical CSS para evitar flash de conteúdo sem estilo */
      #app { min-height: 100vh; }
      .loading { 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        font-family: system-ui, -apple-system, sans-serif;
      }
    </style>
    
    <!-- Verificação SSR-safe para localStorage -->
    <script>
      (function() {
        try {
          // Verificar se localStorage está disponível
          if (typeof Storage !== "undefined") {
            // Aplicar tema salvo, se existir
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            }
            
            // Log para debug (removível em produção)
            console.log('SSR: localStorage acessível');
          }
        } catch(e) {
          console.warn('SSR: localStorage não disponível:', e);
        }
      })();
    </script>
  </head>
  <body>
    <div id="app">${dangerouslySkipEscape(pageHtml)}</div>
    
    <!-- Loading fallback (caso JS falhe) -->
    <noscript>
      <div class="loading">
        <p>Esta aplicação requer JavaScript para funcionar corretamente.</p>
      </div>
    </noscript>
  </body>
</html>`

  return { documentHtml }
}

// Configurações de pré-renderização (opcional)
export const prerender = true