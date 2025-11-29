import { useRef, useState } from 'react'
import { exportChartsAsJson, importChartsFromJson } from '@/lib/storage/json'
import { useChartStore } from '@/lib/state/chartStore'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const loadCharts = useChartStore((state) => state.loadCharts)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleExport = async () => {
    const json = await exportChartsAsJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `starstruck-charts-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const count = await importChartsFromJson(text)
      setImportMessage(`Imported ${count} chart${count === 1 ? '' : 's'}.`)
      await loadCharts()
      setTimeout(() => setImportMessage(null), 3000)
    } catch (error) {
      setImportMessage((error as Error).message)
      setTimeout(() => setImportMessage(null), 3000)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="btn ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal-body">
          <section>
            <h3>Data</h3>
            <p className="field-hint">Export or import your charts as JSON.</p>
            <div className="form-actions">
              <button className="btn secondary" type="button" onClick={handleExport}>
                Export JSON
              </button>
              <button className="btn primary" type="button" onClick={handleImportClick}>
                Import JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                hidden
                onChange={handleImportChange}
              />
            </div>
            {importMessage && <p className="form-error">{importMessage}</p>}
          </section>
        </div>
      </div>
    </div>
  )
}

