/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      colors: {
        // Cores básicas do sistema
        background: '#ffffff',
        foreground: '#0f172a',
        
        // Cores dos cards
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        
        // Cores primárias
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        
        // Cores secundárias
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        
        // Cores de destaque
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        
        // Cores de estado
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        
        success: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },
        
        // Cores de borda e input
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#3b82f6',
        
        // Cores para gráficos
        chart: {
          1: '#3b82f6',
          2: '#ef4444', 
          3: '#22c55e',
          4: '#f59e0b',
          5: '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
}