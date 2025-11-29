import type { ChartInput } from '@/lib/state/chartStore'
import type { ChartEntity } from '@/lib/storage/schema'
import type { ChartFormValues } from '../components/ChartForm'

export function convertFormValuesToChartInput(values: ChartFormValues): ChartInput {
  const name = values.name.trim() || 'Untitled chart'
  const birthTimestamp = values.birthMoment
    ? new Date(values.birthMoment).toISOString()
    : new Date().toISOString()

  const latitude = values.latitude.trim() ? Number(values.latitude) : undefined
  const longitude = values.longitude.trim() ? Number(values.longitude) : undefined

  return {
    name,
    birthTimestamp,
    location: {
      label: values.locationLabel.trim() || 'Unknown location',
      latitude: typeof latitude === 'number' && Number.isFinite(latitude) ? latitude : undefined,
      longitude: typeof longitude === 'number' && Number.isFinite(longitude) ? longitude : undefined,
    },
    notes: values.notes.trim() ? values.notes.trim() : undefined,
  }
}

export function chartEntityToFormValues(chart: ChartEntity): ChartFormValues {
  return {
    name: chart.name,
    birthMoment: chart.birthTimestamp.slice(0, 16),
    locationLabel: chart.location.label,
    latitude: chart.location.latitude?.toString() ?? '',
    longitude: chart.location.longitude?.toString() ?? '',
    notes: chart.notes ?? '',
  }
}

