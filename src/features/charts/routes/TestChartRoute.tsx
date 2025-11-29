import { useEffect, useState } from 'react'
import { computeBirthChart, type BirthChart } from '@/lib/astrology'
import { ChartCanvas } from '../components/ChartCanvas'

// Honolulu, HI coordinates
const HONOLULU_LAT = 21.3099
const HONOLULU_LON = -157.8581

export function TestChartRoute() {
  const [chart, setChart] = useState<BirthChart | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChart = async () => {
      try {
        // Jan 1, 2000 at 12:01 local time in Honolulu, HI (UTC-10)
        // Convert to UTC: 12:01 HST = 22:01 UTC on Jan 1, 2000
        const computed = await computeBirthChart({
          timestamp: '2000-01-01T22:01:00Z',
          latitude: HONOLULU_LAT,
          longitude: HONOLULU_LON,
        })
        setChart(computed)
      } catch (error) {
        console.error('Failed to compute test chart:', error)
      } finally {
        setLoading(false)
      }
    }

    void loadChart()
  }, [])

  if (loading) {
    return (
      <section className="route glass-panel">
        <p>Computing test chart...</p>
      </section>
    )
  }

  if (!chart) {
    return (
      <section className="route glass-panel">
        <p>Failed to compute test chart.</p>
      </section>
    )
  }

  return (
    <section className="route glass-panel">
      <div>
        <p className="eyebrow">Test Chart</p>
        <h2>Jan 1, 2000 at 12:01 in Honolulu, HI</h2>
        <p className="field-hint">
          Latitude: {HONOLULU_LAT}, Longitude: {HONOLULU_LON}
        </p>
      </div>
      <ChartCanvas chart={chart} />
      <div style={{ marginTop: '1.5rem' }}>
        <h3>Planets</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chart.planets.map((planet) => (
            <li key={planet.body} style={{ marginBottom: '0.5rem' }}>
              <strong>{planet.body}</strong>: {planet.longitude.toFixed(2)}° ({planet.sign}, House {planet.house})
              {planet.retrograde && ' (R)'}
            </li>
          ))}
        </ul>
        <h3 style={{ marginTop: '1.5rem' }}>Houses</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chart.houses.map((house) => (
            <li key={house.house} style={{ marginBottom: '0.5rem' }}>
              <strong>House {house.house}</strong>: {house.cuspLongitude.toFixed(2)}° ({house.sign})
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

