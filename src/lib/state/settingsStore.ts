import { create } from 'zustand'
import { db } from '../storage/db'
import type { ThemePreference, ThemeSetting } from '../storage/schema'

interface SettingsState {
  theme: ThemePreference
  hydrated: boolean
  hydrate: () => Promise<void>
  setTheme: (theme: ThemePreference) => Promise<void>
}

const DEFAULT_THEME: ThemePreference = 'system'

export const useSettingsStore = create<SettingsState>()((set) => ({
  theme: DEFAULT_THEME,
  hydrated: false,
  async hydrate() {
    const record = await db.settings.get('theme')
    const theme = isThemeSetting(record) ? record.theme : DEFAULT_THEME
    set({ theme, hydrated: true })
    applyTheme(theme)
  },
  async setTheme(theme) {
    const record: ThemeSetting = { id: 'theme', theme }
    await db.settings.put(record)
    set({ theme })
    applyTheme(theme)
  },
}))

function isThemeSetting(record: unknown): record is ThemeSetting {
  return Boolean(record && typeof record === 'object' && 'theme' in record)
}

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement
  root.dataset.theme = theme
  if (theme === 'light') {
    root.style.colorScheme = 'light'
  } else if (theme === 'dark') {
    root.style.colorScheme = 'dark'
  } else {
    root.style.removeProperty('color-scheme')
  }
}

