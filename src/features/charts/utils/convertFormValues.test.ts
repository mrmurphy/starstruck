import { describe, expect, it } from 'vitest'
import type { ChartFormValues } from '../components/ChartForm'
import { chartEntityToFormValues, convertFormValuesToChartInput } from './convertFormValues'

describe('convertFormValuesToChartInput', () => {
  const baseValues: ChartFormValues = {
    name: 'Sample',
    birthMoment: '2024-01-01T10:00',
    locationLabel: 'Paris, France',
    latitude: '48.8566',
    longitude: '2.3522',
    notes: 'Demo',
  }

  it('converts string inputs into typed chart objects', () => {
    const result = convertFormValuesToChartInput(baseValues)
    expect(result.name).toBe('Sample')
    expect(result.location.latitude).toBeCloseTo(48.8566)
    expect(result.location.longitude).toBeCloseTo(2.3522)
  })

  it('gracefully handles empty optional fields', () => {
    const result = convertFormValuesToChartInput({ ...baseValues, latitude: '', longitude: '' })
    expect(result.location.latitude).toBeUndefined()
    expect(result.location.longitude).toBeUndefined()
  })
})

describe('chartEntityToFormValues', () => {
  it('serializes chart entity into form shape', () => {
    const chart = {
      id: '1',
      name: 'Aurora',
      birthTimestamp: '2024-01-02T00:00:00.000Z',
      location: { label: 'Oslo', latitude: 10, longitude: 20 },
      notes: 'Hello',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    }
    const values = chartEntityToFormValues(chart)
    expect(values.locationLabel).toBe('Oslo')
    expect(values.latitude).toBe('10')
    expect(values.longitude).toBe('20')
  })
})

