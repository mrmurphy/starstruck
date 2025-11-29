import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChartForm, type ChartFormValues } from '../components/ChartForm'
import { chartEntityToFormValues, convertFormValuesToChartInput } from '../utils/convertFormValues'
import { useChartStore } from '@/lib/state/chartStore'

export function NewChartRoute() {
  const createChart = useChartStore((state) => state.createChart)
  const charts = useChartStore((state) => state.charts)
  const status = useChartStore((state) => state.status)
  const loadCharts = useChartStore((state) => state.loadCharts)
  const navigate = useNavigate()
  const location = useLocation()
  const duplicateId = (location.state as { chartId?: string } | undefined)?.chartId

  useEffect(() => {
    if (status === 'idle') {
      void loadCharts()
    }
  }, [status, loadCharts])

  const duplicateChart = charts.find((chart) => chart.id === duplicateId)

  const handleSubmit = async (values: ChartFormValues) => {
    const payload = convertFormValuesToChartInput(values)
    await createChart(payload)
    navigate('/')
  }

  return (
    <section className="route glass-panel form-route">
      <p className="eyebrow">Chart wizard</p>
      <h2>Start a new birth chart</h2>
      <p>Enter the birth details below. We’ll calculate the chart and keep it stored locally on this device.</p>
      <ChartForm
        onSubmit={handleSubmit}
        submitLabel={duplicateChart ? 'Duplicate chart' : 'Save chart'}
        initialValues={duplicateChart ? chartEntityToFormValues(duplicateChart) : undefined}
      />
    </section>
  )
}

