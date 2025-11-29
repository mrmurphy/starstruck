import { useMemo } from 'react'
import type { ThemePreference } from '@/lib/storage/schema'
import { useSettingsStore } from '@/lib/state/settingsStore'

interface ThemeToggleProps {
  variant?: 'chip' | 'inline'
}

const options: ThemePreference[] = ['system', 'light', 'dark']

export function ThemeToggle({ variant = 'chip' }: ThemeToggleProps) {
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)

  const className = useMemo(() => `theme-toggle theme-toggle--${variant}`, [variant])

  return (
    <div className={className} role="group" aria-label="Theme selection">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={option === theme ? 'active' : undefined}
          onClick={() => setTheme(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

