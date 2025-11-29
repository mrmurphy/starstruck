import { db } from './db'
import type { ChartEntity, ExportPayload } from './schema'

const SCHEMA_VERSION = 1

export async function exportChartsAsJson(pretty = true) {
  const charts = await db.charts.orderBy('createdAt').reverse().toArray()
  const payload: ExportPayload = {
    schemaVersion: SCHEMA_VERSION,
    charts,
  }
  return JSON.stringify(payload, null, pretty ? 2 : undefined)
}

export async function importChartsFromJson(json: string) {
  const parsed = safeParse(json)
  if (!Array.isArray(parsed.charts)) {
    throw new Error('Invalid Starstruck export: charts array missing.')
  }

  const sanitized: ChartEntity[] = parsed.charts.map((chart) => ({
    id: chart.id ?? crypto.randomUUID(),
    name: String(chart.name ?? 'Untitled chart'),
    birthTimestamp: new Date(chart.birthTimestamp ?? Date.now()).toISOString(),
    location: {
      label: String(chart.location?.label ?? 'Unknown location'),
      latitude: chart.location?.latitude,
      longitude: chart.location?.longitude,
      timezoneOffsetMinutes: chart.location?.timezoneOffsetMinutes,
    },
    notes: chart.notes?.toString(),
    createdAt: chart.createdAt ? new Date(chart.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))

  await db.charts.bulkPut(sanitized)
  return sanitized.length
}

function safeParse(json: string): ExportPayload {
  const data = JSON.parse(json)
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid Starstruck export: expected object.')
  }
  if (typeof (data as ExportPayload).schemaVersion !== 'number') {
    throw new Error('Invalid Starstruck export: schemaVersion missing.')
  }
  return data as ExportPayload
}

