import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChartStore } from '@/lib/state/chartStore'
import { computeBirthChart, type BirthChart } from '@/lib/astrology'
import { ChartCanvas } from '../components/ChartCanvas'

export function ChartsHomeRoute() {
  const charts = useChartStore((state) => state.charts)
  const status = useChartStore((state) => state.status)
  const loadCharts = useChartStore((state) => state.loadCharts)
  const deleteChart = useChartStore((state) => state.deleteChart)
  const [previewChart, setPreviewChart] = useState<BirthChart | null>(null)
  const computingRef = useRef<string | null>(null)

  useEffect(() => {
    if (status === 'idle') {
      void loadCharts()
    }
  }, [status, loadCharts])

  useEffect(() => {
    let cancelled = false
    const next = charts[0]
    
    if (!next) {
      computingRef.current = null
      // Clear preview when no charts - use setTimeout to avoid synchronous setState
      setTimeout(() => {
        if (!cancelled) {
          setPreviewChart(null)
        }
      }, 0)
      return
    }
    
    const { latitude, longitude } = next.location
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      computingRef.current = null
      return
    }

    if (computingRef.current === next.id) {
      return
    }

    computingRef.current = next.id

    const loadPreview = async () => {
      const computed = await computeBirthChart({
        timestamp: next.birthTimestamp,
        latitude,
        longitude,
      })
      if (!cancelled && computingRef.current === next.id) {
        setPreviewChart(computed)
      }
    }

    void loadPreview()
    return () => {
      cancelled = true
    }
  }, [charts])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this chart?')
    if (confirmed) {
      await deleteChart(id)
    }
  }

  return (
    <section className="route charts-home">
      <section className="glass-panel chart-preview">
        <div className="charts-list__header">
          <div>
            <p className="eyebrow">Your charts</p>
            <h3>{charts.length} saved</h3>
          </div>
          <Link className="btn primary" to="/charts/new">
            Create chart
          </Link>
        </div>
        <ChartCanvas chart={previewChart} />
        <ul className="charts-list">
          {charts.map((chart) => (
            <li key={chart.id}>
              <div className="chart-row">
                <div>
                  <p className="chart-name">{chart.name}</p>
                  <p className="chart-meta">
                    {new Date(chart.birthTimestamp).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                    {' · '}
                    {chart.location.label}
                  </p>
                </div>
                <div className="chart-actions">
                  <Link to="/charts/new" state={{ chartId: chart.id }} className="btn ghost">
                    Duplicate
                  </Link>
                  <button className="btn ghost" type="button" onClick={() => handleDelete(chart.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="charts-status" aria-live="polite">
          {status === 'loading' && 'Loading charts…'}
          {!charts.length && status === 'ready' && 'No charts yet — create one to begin.'}
        </div>
      </section>
    </section>
  )
}

