import type { FinancialState } from '../../../types/pageContext'

interface DataManagementProps {
  financialData: FinancialState
  onDataImport: (data: FinancialState) => void
  onDataClear: () => void
}

export function DataManagement({ financialData, onDataImport, onDataClear }: DataManagementProps) {
  const exportData = () => {
    const dataStr = JSON.stringify(financialData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `backup-financeiro-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          onDataImport(importedData)
          alert('Dados importados com sucesso!')
        } catch {
          alert('Erro ao importar dados. Verifique o formato do arquivo.')
        }
      }
      reader.readAsText(file)
    }
    // Reset input para permitir re-importar o mesmo arquivo
    event.target.value = ''
  }

  const handleDataClear = () => {
    if (confirm('Tem certeza de que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      onDataClear()
      alert('Todos os dados foram limpos.')
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Gestão de Dados</h3>
      
      <div className="flex flex-wrap gap-4">
        <button
          onClick={exportData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          📥 Exportar Dados
        </button>
        
        <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium">
          📤 Importar Dados
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileImport}
          />
        </label>
        
        <button
          onClick={handleDataClear}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          🗑️ Limpar Dados
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        💡 Dica: Exporte regularmente seus dados como backup. Os dados são salvos localmente no seu navegador.
      </p>
    </div>
  )
}