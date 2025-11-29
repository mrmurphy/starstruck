import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSettingsStore } from '@/lib/state/settingsStore'
import { ThemeToggle } from '@/components/ThemeToggle'
import { InstallBanner } from '@/components/InstallBanner'
import { OnboardingSheet } from '@/features/charts/components/OnboardingSheet'
import { SettingsModal } from '@/components/SettingsModal'

const navItems = [
  { to: '/', label: 'Charts' },
  { to: '/charts/new', label: 'New' },
]

export function AppShell() {
  const hydrate = useSettingsStore((state) => state.hydrate)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <div className="app-shell gradient-bg">
      <header className="app-shell__header glass-panel">
        <div>
          <p className="eyebrow">Installable Astrology Companion</p>
          <h1>Starstruck</h1>
        </div>
        <div className="app-shell__header-actions">
          <ThemeToggle />
          <button className="btn ghost" type="button" onClick={() => setSettingsOpen(true)} aria-label="Settings">
            ⚙️
          </button>
        </div>
      </header>

      <main className="app-shell__main">
        <Outlet />
        <InstallBanner />
      </main>

      <nav className="app-shell__nav glass-panel">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <OnboardingSheet />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

