import { useInstallPrompt } from '@/lib/pwa/useInstallPrompt'

export function InstallBanner() {
  const { canInstall, promptInstall, isInstalled } = useInstallPrompt()

  if (!canInstall || isInstalled) return null

  return (
    <div className="install-banner glass-panel">
      <div>
        <p className="eyebrow">Install Starstruck</p>
        <p>Keep the charts one tap away by installing Starstruck on your home screen.</p>
      </div>
      <button className="btn primary" type="button" onClick={promptInstall}>
        Install
      </button>
    </div>
  )
}

