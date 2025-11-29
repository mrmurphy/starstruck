export interface ChartLocation {
  label: string
  latitude?: number
  longitude?: number
  timezoneOffsetMinutes?: number
}

export interface ChartEntity {
  id: string
  name: string
  birthTimestamp: string
  location: ChartLocation
  notes?: string
  createdAt: string
  updatedAt: string
}

export type ThemePreference = 'system' | 'light' | 'dark'

export interface ThemeSetting {
  id: 'theme'
  theme: ThemePreference
}

export interface OnboardingSetting {
  id: 'onboarding'
  completed: boolean
}

export type SettingEntity = ThemeSetting | OnboardingSetting

export interface ExportPayload {
  schemaVersion: number
  charts: ChartEntity[]
}

