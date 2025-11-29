import { create } from 'zustand'
import { db } from '../storage/db'
import type { ChartEntity, ChartLocation } from '../storage/schema'

type ChartStatus = 'idle' | 'loading' | 'ready' | 'error'

export type ChartInput = {
  name: string
  birthTimestamp: string
  location: ChartLocation
  notes?: string
}

interface ChartStoreState {
  charts: ChartEntity[]
  status: ChartStatus
  error?: string
  selectedChartId?: string
  loadCharts: () => Promise<void>
  createChart: (input: ChartInput) => Promise<ChartEntity>
  updateChart: (id: string, patch: Partial<ChartInput>) => Promise<void>
  deleteChart: (id: string) => Promise<void>
  selectChart: (id?: string) => void
}

export const useChartStore = create<ChartStoreState>()((set, get) => ({
  charts: [],
  status: 'idle',
  async loadCharts() {
    if (get().status === 'loading') return
    set({ status: 'loading', error: undefined })
    try {
      const charts = await db.charts.orderBy('createdAt').reverse().toArray()
      set({ charts, status: 'ready' })
    } catch (error) {
      set({ status: 'error', error: (error as Error).message })
    }
  },
  async createChart(input) {
    const chart = await insertChart(input)
    set((state) => ({ charts: [chart, ...state.charts] }))
    return chart
  },
  async updateChart(id, patch) {
    const next = await applyChartPatch(id, patch)
    set((state) => ({
      charts: state.charts.map((chart) => (chart.id === id ? next : chart)),
    }))
  },
  async deleteChart(id) {
    await db.charts.delete(id)
    set((state) => ({
      charts: state.charts.filter((chart) => chart.id !== id),
      selectedChartId: state.selectedChartId === id ? undefined : state.selectedChartId,
    }))
  },
  selectChart(id) {
    set({ selectedChartId: id })
  },
}))

async function insertChart(input: ChartInput): Promise<ChartEntity> {
  const now = new Date().toISOString()
  const chart: ChartEntity = {
    id: crypto.randomUUID(),
    name: input.name,
    birthTimestamp: input.birthTimestamp,
    location: input.location,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  }
  await db.charts.put(chart)
  return chart
}

async function applyChartPatch(id: string, patch: Partial<ChartInput>) {
  const existing = await db.charts.get(id)
  if (!existing) throw new Error('Chart not found')
  const updated: ChartEntity = {
    ...existing,
    ...patch,
    location: patch.location ?? existing.location,
    birthTimestamp: patch.birthTimestamp ?? existing.birthTimestamp,
    updatedAt: new Date().toISOString(),
  }
  await db.charts.put(updated)
  return updated
}

