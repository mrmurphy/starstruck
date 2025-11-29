import Dexie, { type Table } from 'dexie'
import type { ChartEntity, SettingEntity } from './schema'

class StarstruckDB extends Dexie {
  charts!: Table<ChartEntity, string>
  settings!: Table<SettingEntity, string>

  constructor() {
    super('StarstruckDB')
    this.version(1).stores({
      charts: '&id, name, birthTimestamp',
      settings: '&id',
    })
  }
}

export const db = new StarstruckDB()

