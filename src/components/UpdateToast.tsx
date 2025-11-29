import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()

  const close = () => {
    setNeedRefresh(false)
    setOfflineReady(false)
  }

  if (!needRefresh && !offlineReady) return null

  return (
    <div className="update-toast glass-panel">
      <div>
        <p className="eyebrow">{needRefresh ? 'Update available' : 'Offline ready'}</p>
        <p>{needRefresh ? 'Reload to upgrade to the latest build.' : 'Starstruck is cached for offline use.'}</p>
      </div>
      <div className="toast-actions">
        {needRefresh && (
          <button className="btn primary" type="button" onClick={() => updateServiceWorker(true)}>
            Reload
          </button>
        )}
        <button className="btn ghost" type="button" onClick={close}>
          Dismiss
        </button>
      </div>
    </div>
  )
}

